from django.core.management.base import BaseCommand
from datetime import time
from api.models import FoodCourt, MenuItem


class Command(BaseCommand):
    help = 'Seed food courts and menu items'

    def handle(self, *args, **kwargs):
        self.seed_courts()
        self.seed_menu()
        self.stdout.write(self.style.SUCCESS('\n✅  Database seeded successfully!\n'))

    def seed_courts(self):
        self.stdout.write('Seeding food courts...')
        # Specific court numbers as requested: 3,6,7,8,12,14,15,25 + KIIT Kafeteria
        courts = [
            {'court_number': 3,  'name': 'Food Court 3',      'status': 'open',   'total_tables': 24, 'available_tables': 18},
            {'court_number': 6,  'name': 'Food Court 6',      'status': 'open',   'total_tables': 20, 'available_tables': 14},
            {'court_number': 7,  'name': 'Food Court 7',      'status': 'busy',   'total_tables': 18, 'available_tables': 3},
            {'court_number': 8,  'name': 'Food Court 8',      'status': 'open',   'total_tables': 22, 'available_tables': 16},
            {'court_number': 12, 'name': 'Food Court 12',     'status': 'open',   'total_tables': 16, 'available_tables': 10},
            {'court_number': 14, 'name': 'Food Court 14',     'status': 'busy',   'total_tables': 20, 'available_tables': 4},
            {'court_number': 15, 'name': 'Food Court 15',     'status': 'open',   'total_tables': 18, 'available_tables': 12},
            {'court_number': 25, 'name': 'Food Court 25',     'status': 'open',   'total_tables': 30, 'available_tables': 22},
            {'court_number': 0,  'name': 'KIIT Kafeteria',    'status': 'open',   'total_tables': 50, 'available_tables': 35},
        ]
        for c in courts:
            FoodCourt.objects.get_or_create(
                court_number=c['court_number'],
                defaults={
                    'name': c['name'],
                    'status': c['status'],
                    'opening_time': time(9, 0),
                    'closing_time': time(19, 0),
                    'total_tables': c['total_tables'],
                    'available_tables': c['available_tables'],
                    'is_active': True,
                }
            )
        self.stdout.write(f'  ✓ {len(courts)} food courts created')

    def seed_menu(self):
        self.stdout.write('Seeding menu items...')
        items = [
            # ── FOOD ──
            dict(name='Masala Dosa',                     category='Food',      price=70,  quantity='1 regular', is_veg=True,  prep_time=12, image_url='https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80', description='Crispy rice crepe stuffed with spiced potato, served with chutney & sambhar'),
            dict(name='South Indian Vada',               category='Food',      price=50,  quantity='5 pcs',     is_veg=True,  prep_time=8,  image_url='https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80', description='Crispy deep-fried lentil doughnuts with coconut chutney'),
            dict(name='Plain Dosa',                      category='Food',      price=60,  quantity='1 regular', is_veg=True,  prep_time=10, image_url='https://images.unsplash.com/photo-1694499496221-1eb2a64e0d8b?w=400&q=80', description='Thin crispy rice crepe with chutney and sambhar'),
            dict(name='Onion Uttapam',                   category='Food',      price=60,  quantity='1 regular', is_veg=True,  prep_time=10, image_url='https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', description='Thick rice pancake topped with fresh onions'),
            dict(name='Masala Uttapam',                  category='Food',      price=70,  quantity='1 regular', is_veg=True,  prep_time=10, image_url='https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', description='Thick rice pancake loaded with mixed vegetable masala'),
            dict(name='South Indian Idli',               category='Food',      price=50,  quantity='5 pcs',     is_veg=True,  prep_time=8,  image_url='https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80', description='Soft steamed rice cakes with sambhar and chutney'),
            dict(name='Veg Roll',                        category='Food',      price=65,  quantity='1',         is_veg=True,  prep_time=8,  image_url='https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80', description='Crispy paratha wrap filled with spiced mixed vegetables'),
            dict(name='Paneer Roll',                     category='Food',      price=75,  quantity='1',         is_veg=True,  prep_time=10, image_url='https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', description='Soft paratha roll stuffed with marinated paneer'),
            dict(name='Egg Roll',                        category='Food',      price=75,  quantity='1',         is_veg=False, prep_time=8,  image_url='https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', description='Flaky paratha roll with a fluffy egg omelette inside'),
            dict(name='Egg Chicken Roll',                category='Food',      price=75,  quantity='1',         is_veg=False, prep_time=12, image_url='https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80', description='Hearty roll with egg and spiced chicken wrapped in paratha'),
            dict(name='KIIT Spl Double Egg Chicken Roll',category='Food',      price=100, quantity='1',         is_veg=False, prep_time=15, image_url='https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', description="KIIT's special — double egg + chicken roll, loaded and delicious"),
            dict(name='Shawarma Roll',                   category='Food',      price=110, quantity='1',         is_veg=False, prep_time=15, image_url='https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', description='Middle-Eastern wrap with chicken, garlic sauce and veggies'),
            # ── SNACKS ──
            dict(name='Paneer Pakoda',                   category='Snacks',    price=120, quantity='8 pcs',     is_veg=True,  prep_time=8,  image_url='https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=400&q=80', description='Golden fried cottage cheese fritters with mint chutney'),
            dict(name='Chicken Pakoda',                  category='Snacks',    price=120, quantity='8 pcs',     is_veg=False, prep_time=10, image_url='https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&q=80', description='Crispy fried chicken bites in spiced gram flour batter'),
            dict(name='Chips',                           category='Snacks',    price=20,  quantity='1 pack',    is_veg=True,  prep_time=1,  image_url='https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&q=80', description='Crunchy salted potato chips'),
            dict(name='Muffins',                         category='Snacks',    price=15,  quantity='1',         is_veg=True,  prep_time=1,  image_url='https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80', description='Soft freshly baked muffin — chocolate or vanilla'),
            dict(name='Brownie',                         category='Snacks',    price=55,  quantity='1',         is_veg=True,  prep_time=1,  image_url='https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80', description='Rich fudgy chocolate brownie'),
            dict(name='Pastry',                          category='Snacks',    price=55,  quantity='1',         is_veg=False, prep_time=1,  image_url='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', description='Creamy layered pastry — chocolate or butterscotch'),
            dict(name='Veg Patties',                     category='Snacks',    price=20,  quantity='1',         is_veg=True,  prep_time=3,  image_url='https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=80', description='Crispy puff pastry with spiced vegetable filling'),
            dict(name='Chicken Patties',                 category='Snacks',    price=20,  quantity='1',         is_veg=False, prep_time=3,  image_url='https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=80', description='Flaky puff pastry stuffed with minced chicken masala'),
            dict(name='Samosa',                          category='Snacks',    price=20,  quantity='1',         is_veg=True,  prep_time=3,  image_url='https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', description='Classic crispy fried triangle with spiced potato filling'),
            dict(name='Cup Noodles Maggi',               category='Snacks',    price=20,  quantity='1 cup',     is_veg=True,  prep_time=5,  image_url='https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', description='Hot instant Maggi noodles in a cup'),
            # ── BEVERAGES ──
            dict(name='Masala Tea',                      category='Beverages', price=20,  quantity='100 ml',    is_veg=True,  prep_time=4,  image_url='https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80', description='Aromatic spiced milk tea with ginger and cardamom'),
            dict(name='South Indian Coffee',             category='Beverages', price=20,  quantity='100 ml',    is_veg=True,  prep_time=4,  image_url='https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400&q=80', description='Strong filter coffee with frothed milk'),
            dict(name='Fresh Seasonal Juice',            category='Beverages', price=60,  quantity='180 ml',    is_veg=True,  prep_time=5,  image_url='https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80', description='Freshly squeezed juice of the day'),
            dict(name='Vanilla Shake',                   category='Beverages', price=60,  quantity='180 ml',    is_veg=True,  prep_time=5,  image_url='https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80', description='Creamy chilled vanilla milkshake'),
            dict(name='Chocolate Shake',                 category='Beverages', price=60,  quantity='180 ml',    is_veg=True,  prep_time=5,  image_url='https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80', description='Rich thick chocolate milkshake'),
            dict(name='Oreo Shake',                      category='Beverages', price=60,  quantity='180 ml',    is_veg=True,  prep_time=5,  image_url='https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80', description='Blended Oreo cookie milkshake'),
            dict(name='Banana Shake',                    category='Beverages', price=60,  quantity='180 ml',    is_veg=True,  prep_time=5,  image_url='https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400&q=80', description='Fresh banana blended with chilled milk'),
            dict(name='Packed Juice (Tropicana)',        category='Beverages', price=20,  quantity='1 pack',    is_veg=True,  prep_time=1,  image_url='https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80', description='Tropicana tetra pack — orange, apple or mixed fruit'),
            dict(name='Amul Taaza',                      category='Beverages', price=20,  quantity='1 pack',    is_veg=True,  prep_time=1,  image_url='https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80', description='Amul Taaza toned milk 200ml'),
            dict(name='Amul Masti',                      category='Beverages', price=20,  quantity='1 pack',    is_veg=True,  prep_time=1,  image_url='https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80', description='Amul Masti spiced buttermilk'),
            dict(name='Amul Kool',                       category='Beverages', price=20,  quantity='1 pack',    is_veg=True,  prep_time=1,  image_url='https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80', description='Amul Kool flavoured milk — chocolate or rose'),
        ]
        count = 0
        for d in items:
            _, created = MenuItem.objects.get_or_create(name=d['name'], defaults=d)
            if created:
                count += 1
        self.stdout.write(f'  ✓ {count} menu items created')
