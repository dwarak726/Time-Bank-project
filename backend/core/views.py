from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.db import transaction

from .models import Profile, Task, TimeTransaction, Dispute, Job, Service
from .serializers import (
    ProfileSerializer, TaskSerializer,
    TimeTransactionSerializer, DisputeSerializer, JobSerializer,
    ServiceSerializer, UserSerializer, LoginSerializer, SignupSerializer
)

class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profile.objects.select_related('user')
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        profile = self.get_object()

        user = profile.user

        data = ProfileSerializer(profile).data
        data['completed_services'] = user.created_tasks.filter(status='COMPLETED').count()
        data['available_slots'] = user.assigned_tasks.filter(status='OPEN').count()

        # ✅ Add this line to include assigned (claimed) tasks:
        data['assigned_task_ids'] = list(user.assigned_tasks.values_list('id', flat=True))

        return Response(data)

# Claimed/Assigned tasks for the current user
class AssignedTaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(assignee=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # filter out any task that is already claimed or not OPEN
        return Task.objects.filter(is_claimed=False, status='OPEN')

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


# Time Transaction ViewSet
class TimeTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TimeTransaction.objects.all()
    serializer_class = TimeTransactionSerializer
    permission_classes = [IsAuthenticated]


# Dispute ViewSet
class DisputeViewSet(viewsets.ModelViewSet):
    queryset = Dispute.objects.all()
    serializer_class = DisputeSerializer
    permission_classes = [IsAuthenticated]


# Signup View (Open to Everyone)
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': UserSerializer(user).data,
                'message': 'User created successfully!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login View (Open to Everyone)
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid credentials")

        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            raise AuthenticationFailed("Invalid credentials")


# Task List View
class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(creator=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# User Tokens View
class UserTokensView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        return Response({"tokens": user.profile.time_tokens})  # Fixed to access profile


# Job History View
class JobHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        # show all jobs that were claimed by this user
        jobs = Job.objects.filter(claimed_by_id=user_id)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)


# Service List View
class ServiceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)


class ClaimTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

        if task.assignee is not None or task.status != 'OPEN':
            return Response({"error": "Task already claimed or not open."}, status=status.HTTP_400_BAD_REQUEST)

        task.assignee = request.user
        task.is_claimed = True  # Optional
        task.status = 'ASSIGNED'
        task.save()

        return Response({"message": "Task claimed successfully!"}, status=status.HTTP_200_OK)

class CommissionedTaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(creator=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class CompleteTaskTransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        task_id     = request.data.get('task_id')
        receiver_id = request.data.get('receiver_id')
        hours       = float(request.data.get('hours', 0))

        try:
            task = Task.objects.get(id=task_id, creator=request.user)
        except Task.DoesNotExist:
            return Response({"error": "Not found or not your task"}, status=404)

        if task.status == 'COMPLETED':
            return Response({"error": "Already completed"}, status=400)

        with transaction.atomic():
            # mark task complete
            task.status = 'COMPLETED'
            task.save()

            # adjust tokens
            sender = request.user.profile
            receiver = User.objects.get(id=receiver_id).profile

            if sender.time_tokens < hours:
                return Response({"error": "Insufficient tokens"}, status=400)

            sender.time_tokens   -= hours
            receiver.time_tokens += hours
            sender.save()
            receiver.save()

            # record the transaction
            TimeTransaction.objects.create(
                from_user=task.creator,
                to_user=User.objects.get(id=receiver_id),
                task=task,
                amount=hours
            )

        return Response({"message": "Success"}, status=200)