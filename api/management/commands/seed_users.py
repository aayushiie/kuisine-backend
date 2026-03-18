from django.core.management.base import BaseCommand
from api.models import User
from rest_framework.authtoken.models import Token


class Command(BaseCommand):
    help = 'Create demo student and staff accounts'

    def handle(self, *args, **kwargs):
        # Demo Student
        student, created = User.objects.get_or_create(
            email='student@kiit.ac.in',
            defaults={'name': 'Demo Student', 'role': 'student', 'roll_number': '2305675', 'is_active': True}
        )
        if created:
            student.set_password('password123')
            student.save()
        Token.objects.get_or_create(user=student)

        # Demo Staff
        staff, created = User.objects.get_or_create(
            email='staff@kiit.ac.in',
            defaults={'name': 'Demo Staff', 'role': 'staff', 'is_active': True, 'is_staff': True}
        )
        if created:
            staff.set_password('password123')
            staff.save()
        Token.objects.get_or_create(user=staff)

        self.stdout.write(self.style.SUCCESS(
            '\n✅  Demo accounts created!\n'
            '   👨‍🎓 Student: student@kiit.ac.in / password123\n'
            '   👨‍🍳 Staff:   staff@kiit.ac.in   / password123\n'
        ))
