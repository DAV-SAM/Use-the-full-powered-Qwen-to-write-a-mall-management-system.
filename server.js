const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('数据库连接失败:', err);
    } else {
        console.log('数据库连接成功');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT NOT NULL,
            description TEXT,
            stock INTEGER DEFAULT 0
        )`, () => {
            db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
                if (!err && row.count === 0) {
                    const products = [
                        ['iPhone 15 Pro', '手机', 7999, '/images/iphone15.jpg', '6.1英寸超视网膜XDR显示屏，A17 Pro芯片', 50],
                        ['MacBook Pro 14', '笔记本', 14999, '/images/macbook.jpg', 'M3芯片，14英寸Liquid视网膜XDR显示屏', 30],
                        ['iPad Air', '平板', 4799, '/images/ipad.jpg', '10.9英寸液态视网膜显示屏，M1芯片', 40],
                        ['AirPods Pro', '耳机', 1899, '/images/airpods.jpg', '主动降噪，空间音频', 100],
                        ['Apple Watch Series 9', '智能手表', 3199, '/images/watch.jpg', '血氧检测，心率监测，GPS', 60],
                        ['Samsung Galaxy S24', '手机', 5999, '/images/samsung.jpg', '6.2英寸动态AMOLED显示屏，骁龙8 Gen 3', 45],
                        ['Sony WH-1000XM5', '耳机', 2499, '/images/sony.jpg', '业界领先降噪，30小时续航', 70],
                        ['Dell XPS 15', '笔记本', 12999, '/images/dell.jpg', 'Intel i7-13700H，RTX 4060', 25]
                    ];

                    const stmt = db.prepare('INSERT INTO products (name, category, price, image, description, stock) VALUES (?, ?, ?, ?, ?, ?)');
                    products.forEach(p => stmt.run(p));
                    stmt.finalize();
                    console.log('商品数据初始化完成');
                }
            });
        });

        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            productId INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            totalPrice REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id)
        )`);
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: '密码长度至少为6位' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run('INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: '用户名已存在' });
                    }
                    return res.status(500).json({ error: '注册失败' });
                }
                res.json({ message: '注册成功', userId: this.lastID });
            }
        );
    } catch (error) {
        res.status(500).json({ error: '服务器错误' });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: '服务器错误' });
        }

        if (!user) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.json({ message: '登录成功', userId: user.id });
            } else {
                res.status(401).json({ error: '用户名或密码错误' });
            }
        } catch (error) {
            res.status(500).json({ error: '服务器错误' });
        }
    });
});

app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', (err, products) => {
        if (err) {
            return res.status(500).json({ error: '获取商品失败' });
        }
        res.json(products);
    });
});

app.get('/products/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err) {
            return res.status(500).json({ error: '获取商品失败' });
        }
        if (!product) {
            return res.status(404).json({ error: '商品不存在' });
        }
        res.json(product);
    });
});

app.post('/orders', (req, res) => {
    const { productId, quantity, userId } = req.body;

    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) {
            return res.status(404).json({ error: '商品不存在' });
        }

        const totalPrice = product.price * quantity;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wxp://pay?amount=${totalPrice}&product=${encodeURIComponent(product.name)}`;

        db.run('INSERT INTO orders (userId, productId, quantity, totalPrice) VALUES (?, ?, ?, ?)',
            [userId || null, productId, quantity, totalPrice],
            function(insertErr) {
                if (insertErr) {
                    console.error('保存订单失败:', insertErr);
                }
            }
        );

        res.json({
            orderId: Date.now(),
            product: product.name,
            quantity,
            totalPrice,
            qrCodeUrl
        });
    });
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'root' && password === 'root') {
        res.json({ success: true, message: '登录成功' });
    } else {
        res.status(401).json({ error: '管理员账号或密码错误' });
    }
});

app.get('/admin/users', (req, res) => {
    db.all('SELECT id, username, password, created_at FROM users ORDER BY id DESC', (err, users) => {
        if (err) {
            return res.status(500).json({ error: '获取用户失败' });
        }
        res.json(users);
    });
});

app.get('/admin/orders', (req, res) => {
    db.all(`SELECT o.*, u.username, p.name as productName
            FROM orders o
            LEFT JOIN users u ON o.userId = u.id
            LEFT JOIN products p ON o.productId = p.id
            ORDER BY o.id DESC`, (err, orders) => {
        if (err) {
            return res.status(500).json({ error: '获取订单失败' });
        }
        res.json(orders);
    });
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
