import React from 'react'

function Ribbons({title, type = "popular"}) {
    return (
        <div>
            <span className={`ribbon ribbon-${type}`}>{title}</span>
        </div>
    )
}

export default Ribbons