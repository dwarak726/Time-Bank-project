from rest_framework import viewsets, permissions, status, serializers
from rest_framework.views import APIView
from .models import Profile, Task, TimeTransaction, Dispute, Job, User, Service
from .serializers import (
    ProfileSerializer, TaskSerializer,
    TimeTransactionSerializer, DisputeSerializer, JobSerializer, ServiceSerializer,
    UserSerializer, LoginSerializer, SignupSerializer
)
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User


class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profile.objects.select_related('user')
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        profile = self.get_object()  # Get the Profile object
        # Serialize the profile data
        data = ProfileSerializer(profile).data
        # Add custom fields for completed services and available slots
        data['completed_services'] = profile.user.created_tasks.filter(status='COMPLETED').count()
        data['available_slots'] = profile.user.assigned_tasks.filter(status='OPEN').count()  # Example logic
        return Response(data)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class TimeTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TimeTransaction.objects.all()
    serializer_class = TimeTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

class DisputeViewSet(viewsets.ModelViewSet):
    queryset = Dispute.objects.all()
    serializer_class = DisputeSerializer
    permission_classes = [permissions.IsAuthenticated]

# Signup View
class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': UserSerializer(user).data,
                'message': 'User created successfully!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login View
class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)  # Corrected here
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid credentials")

        # Validate user credentials
        if user.check_password(password):  # Ensure the password is correct
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            user_data = UserSerializer(user).data
            return Response({
                'user': user_data,
                'access': access_token,
                'refresh': refresh_token
            }, status=status.HTTP_200_OK)
        else:
            raise AuthenticationFailed("Invalid credentials")


class TaskListView(APIView):
    def get(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserTokensView(APIView):
    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        return Response({"tokens": user.time_tokens})

class JobHistoryView(APIView):
    def get(self, request, user_id):
        jobs = Job.objects.filter(user_id=user_id)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

class ServiceListView(APIView):
    def get(self, request):
        services = Service.objects.all()  # Fetch all services, you can filter by user if needed
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

class ClaimTaskView(APIView):
    def post(self, request, task_id):
        task = Task.objects.get(id=task_id)
        if task.is_claimed:  # Assuming you have an `is_claimed` field
            return Response({"message": "Task already claimed!"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark task as claimed
        task.is_claimed = True
        task.claimed_by = request.user  # Assuming the user is authenticated
        task.save()

        return Response({"message": "Task claimed successfully!"}, status=status.HTTP_200_OK)
