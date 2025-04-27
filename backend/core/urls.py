router = DefaultRouter()
router.register('profiles', ProfileViewSet)
router.register('tasks',    TaskViewSet)
router.register('transactions', TimeTransactionViewSet)
router.register('disputes', DisputeViewSet)

urlpatterns = [
    path('signup/',         SignupView.as_view(),      name='signup'),         # POST /api/signup/
    path('login/',          LoginView.as_view(),       name='login'),          # POST /api/login/
    path('tasklist/',       TaskListView.as_view(),    name='tasklist'),       # GET/POST /api/tasklist/
    path('user-tokens/<int:user_id>/', UserTokensView.as_view(), name='user-tokens'),
    path('job-history/<int:user_id>/', JobHistoryView.as_view(), name='job-history'),
    path('services/',       ServiceListView.as_view(), name='services'),
    path('claim-task/<int:task_id>/', ClaimTaskView.as_view(), name='claim-task'),

    path('', include(router.urls)),  # /api/profiles/, /api/tasks/, etc.
]
