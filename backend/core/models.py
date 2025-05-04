from django.db import models
from django.conf import settings
from django.db import models
from django.utils import timezone

User = settings.AUTH_USER_MODEL

class Profile(models.Model):
    user        = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    time_tokens = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.user.username}: {self.time_tokens:.1f}h"

class Job(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    token_cost = models.IntegerField()
    is_claimed = models.BooleanField(default=False)  # Example field
    claimed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title
from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    title       = models.CharField(max_length=200)
    description = models.TextField()
    creator     = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    assignee    = models.ForeignKey(User, null=True, blank=True,
                                    on_delete=models.SET_NULL, related_name='assigned_tasks')
    token_cost  = models.FloatField(help_text='Hours required')
    start_at    = models.DateTimeField()
    end_at      = models.DateTimeField()
    status      = models.CharField(max_length=12, choices=STATUS_CHOICES, default='OPEN')
    is_claimed  = models.BooleanField(default=False)  # Added to track if the task is claimed
    claimed_by  = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='claimed_tasks')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.get_status_display()}] {self.title}"


class TimeTransaction(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='outgoing')
    to_user   = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incoming')
    task      = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='transactions')
    amount    = models.FloatField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.from_user}→{self.to_user} : {self.amount}h"


class Dispute(models.Model):
    task        = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='disputes')
    raised_by   = models.ForeignKey(User, on_delete=models.CASCADE, related_name='disputes_raised')
    message     = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        status = 'Resolved' if self.is_resolved else 'Open'
        return f"[{status}] {self.raised_by.username} on {self.task.title}"


class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title