#!/bin/bash
sudo docker exec -i rntschool_db mysql -uroot -prootpassword school -e "UPDATE users SET password_hash = '\$2b\$10\$nigwh4VfT5XwPb6sSXNua.r.sG9tA9AiWhtfQMAvTcB1bNNQoSttm' WHERE email = 'admin@school.com';"
echo "=========================================================="
echo "✅ Admin credentials updated successfully!"
echo "👉 Email:    admin@school.com"
echo "👉 Password: admin123"
echo "=========================================================="
