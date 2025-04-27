# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from core.views import (
    ProfileViewSet, TaskViewSet, TimeTransactionViewSet, DisputeViewSet,
    SignupView, LoginView, UserTokensView, JobHistoryView, ServiceListView, ClaimTaskView,
    CommissionedTaskListView, CompleteTaskTransactionView
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'tasks',    TaskViewSet,      basename='task')
router.register(r'transactions', TimeTransactionViewSet, basename='transaction')
router.register(r'disputes', DisputeViewSet,   basename='dispute')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/auth/signup/', SignupView.as_view(), name='signup'),
    path('api/auth/login/',  LoginView.as_view(),  name='login'),

    # Router-powered CRUD
    path('api/', include(router.urls)),

    # Non-router endpoints
    path('api/user/<int:user_id>/tokens/', UserTokensView.as_view(), name='user-tokens'),
    path('api/jobs/history/<int:user_id>/', JobHistoryView.as_view(), name='job-history'),
    path('api/services/', ServiceListView.as_view(), name='service-list'),
    path('api/tasks/<int:task_id>/claim/', ClaimTaskView.as_view(), name='claim-task'),

    # **NEW** commissioned tasks & completion
    path('api/commissioned-tasks/', CommissionedTaskListView.as_view(), name='commissioned-tasks'),
    path('api/complete-transaction/', CompleteTaskTransactionView.as_view(), name='complete-transaction'),

    # Optional for browsable API & token-auth
    path('api-auth/', include('rest_framework.urls')),
    path('api/token-auth/', obtain_auth_token),
]
