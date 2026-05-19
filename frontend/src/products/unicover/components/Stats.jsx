import React, { useEffect } from 'react'

function Stats() {
    useEffect(() => {
        if (typeof window.loadStats === "function") {
            window.loadStats();
        }
    }, []);

    return (
        <div className="stats-container" id="statsContainer" style={{ display: 'none' }}>
            <div className="stat-card">
                <h2 id="userCount">0</h2>
                <p>Total Users</p>
            </div>

            <div className="stat-card">
                <h2 id="downloadCount">0</h2>
                <p>Total Downloads</p>
            </div>
        </div>
    )
}

export default Stats