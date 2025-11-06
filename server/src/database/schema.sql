-- Create database tables for financial monitoring system

CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('STOCK', 'ETF', 'CRYPTO')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
    price DECIMAL(20, 8) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(asset_id, timestamp)
);

CREATE INDEX idx_price_history_asset_time ON price_history(asset_id, timestamp DESC);

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    condition VARCHAR(10) NOT NULL CHECK (condition IN ('ABOVE', 'BELOW')),
    target_price DECIMAL(20, 8) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    triggered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_active ON alerts(is_active, asset_id);

CREATE TABLE IF NOT EXISTS probability_cache (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
    target_increase DECIMAL(5, 4) NOT NULL, -- 0.30 for 30%
    probability DECIMAL(5, 4) NOT NULL,
    historical_volatility DECIMAL(10, 8),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(asset_id, target_increase)
);

-- Insert some sample assets
INSERT INTO assets (symbol, name, type) VALUES
    ('AAPL', 'Apple Inc.', 'STOCK'),
    ('GOOGL', 'Alphabet Inc.', 'STOCK'),
    ('MSFT', 'Microsoft Corporation', 'STOCK'),
    ('SPY', 'SPDR S&P 500 ETF', 'ETF'),
    ('QQQ', 'Invesco QQQ Trust', 'ETF'),
    ('BTC', 'Bitcoin', 'CRYPTO'),
    ('ETH', 'Ethereum', 'CRYPTO')
ON CONFLICT (symbol) DO NOTHING;
