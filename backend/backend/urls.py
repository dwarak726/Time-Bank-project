from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from core import views  # Correct import
from core.views import (
    ProfileViewSet, TaskViewSet, 
    TimeTransactionViewSet, DisputeViewSet,
    JobHistoryView, ServiceListView, ClaimTaskView, TaskListView
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'transactions', TimeTransactionViewSet, basename='transaction')
router.register(r'disputes', DisputeViewSet, basename='dispute')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/signup/', views.SignupView.as_view(), name='signup'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token-auth/', obtain_auth_token),
    path('tasks/', TaskListView.as_view(), name='task-list'),
    path('tasks/<int:task_id>/claim/', ClaimTaskView.as_view(), name='claim-task'),
    path('jobs/<int:user_id>/', JobHistoryView.as_view(), name='job-history'),
    path('services/', ServiceListView.as_view(), name='service-list'),
]
