// Direct database seeding script
const db = require('./config/db');

async function seedBusRoutes() {
  try {
    const defaultRoutes = [
      ['Route A - North', 'A-101', 'Rajesh Kumar', '9876543210', 45, 'North side pick-up route'],
      ['Route B - South', 'B-102', 'Priya Sharma', '9876543211', 50, 'South side pick-up route'],
      ['Route C - East', 'C-103', 'Vikram Singh', '9876543212', 48, 'East side pick-up route'],
      ['Route D - West', 'D-104', 'Anjali Verma', '9876543213', 50, 'West side pick-up route']
    ];

    let insertedCount = 0;
    for (const route of defaultRoutes) {
      try {
        const [result] = await db.execute(
          'INSERT IGNORE INTO bus_routes (bus_name, route_number, driver_name, driver_contact, capacity, notes) VALUES (?, ?, ?, ?, ?, ?)',
          route
        );
        if (result.affectedRows > 0) {
          insertedCount++;
          console.log(`✓ Created: ${route[0]}`);
        } else {
          console.log(`- Skipped: ${route[0]} (already exists)`);
        }
      } catch (e) {
        console.error(`✗ Error creating ${route[0]}:`, e.message);
      }
    }

    console.log(`\n✓ Seeding complete! ${insertedCount} routes created.`);
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
}

seedBusRoutes();
