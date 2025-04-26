

from django.contrib import admin
from .models import Profile, Task, TimeTransaction, Dispute

admin.site.register(Profile)
admin.site.register(Task)
admin.site.register(TimeTransaction)
admin.site.register(Dispute)
