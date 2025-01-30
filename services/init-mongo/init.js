db = db.getSiblingDB('um'); // Switch to the um database

db.createUser({
  user: 'um',
  pwd: 'um-password',
  roles: [
    {
      role: 'readWrite',
      db: 'um', // The database to which the user is assigned
    },
  ],
});

print('Database and application user created successfully');
