import React from 'react'

import { Link } from 'react-router-dom';

export default function HomeIcon() {
    return (
        <Link to="/" style={{height: '48px'}}>
            <div className="flex-row center homeIconContainer">
                <div>
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 106.58 122.88" style={{enableBackground: "new 0 0 106.58 122.88"}} xmlSpace="preserve" style={{width: '30px'}}><g><path style={{fill: "#8CA532"}} d="M84.36,11.89l0.08-0.11c1.38,1.1,2.83,1.82,4.56,2.06l-0.04,0.06c8.11,1.94,12.77,5.84,14.42,11.45 c1.79,6.1-0.27,13.99-5.55,23.37c-0.87,1.95-1.58,3.92-2.15,5.92c-0.58,2.04-1,4.05-1.26,6.03c-0.73,5.61-0.34,9.5,0.01,13.07 c0.64,6.48,1.2,12.04-4.07,24.18c-3.12,7.2-7.46,13.25-13.58,17.61c-6.1,4.35-13.92,6.99-23.99,7.35l0,0c-0.04,0-0.08,0-0.12,0 c-9.23-0.11-17.58-1.79-24.94-5.27c-7.42-3.51-13.78-8.84-18.96-16.21l0,0c-0.02-0.03-0.04-0.06-0.06-0.09 c-6.03-9.39-8.89-18.31-8.69-26.8c0.2-8.57,3.48-16.58,9.71-24.07c6.89-8.28,12.07-11.07,18.39-14.45c2.71-1.46,5.64-3.03,8.97-5.2 c3.17-2.07,6.08-4.37,8.7-6.92c2.59-2.51,4.88-5.26,6.87-8.25c0.06-0.1,0.13-0.19,0.2-0.28c5.85-7.12,11.67-9.9,17.43-9.68 C75.17,5.84,79.83,8.2,84.36,11.89L84.36,11.89L84.36,11.89z"/><path style={{fill: "#7F573C"}} d="M84.28,11.89c2.6-3.76,5.35-6.75,8.26-8.78c3.76-2.63,7.78-3.68,12.08-2.8c1.33,0.27,2.18,1.56,1.91,2.89 c-0.27,1.33-1.56,2.18-2.89,1.91c-2.89-0.59-5.64,0.16-8.3,2.01c-2.23,1.55-4.38,3.87-6.5,6.83 C87.11,13.72,85.66,12.99,84.28,11.89L84.28,11.89z"/><path style={{fill: "#9AB748"}} d="M93.51,46.36c4.64-8.25,6.55-14.89,5.15-19.64c-1.3-4.45-5.83-7.43-14.11-8.69c-0.58-0.09-1.08-0.37-1.44-0.77 c-4.36-3.96-8.7-6.55-12.99-6.73c-4.23-0.16-8.67,2.09-13.4,7.82c-2.18,3.29-4.69,6.28-7.5,9.02c-2.84,2.76-5.99,5.25-9.45,7.51 c-3.54,2.31-6.55,3.92-9.32,5.41c-5.87,3.15-10.69,5.73-16.95,13.26c-5.5,6.61-8.41,13.62-8.58,21.04 c-0.17,7.48,2.41,15.47,7.89,24c4.66,6.65,10.38,11.43,17.01,14.56c6.69,3.16,14.34,4.69,22.82,4.81 c9.03-0.32,15.95-2.63,21.29-6.43c5.33-3.8,9.15-9.16,11.92-15.55c4.76-10.97,4.26-15.96,3.68-21.76 c-0.38-3.83-0.79-7.99,0.01-14.16c0.3-2.29,0.76-4.54,1.39-6.77c0.63-2.22,1.45-4.46,2.46-6.72C93.44,46.5,93.48,46.43,93.51,46.36 L93.51,46.36L93.51,46.36L93.51,46.36z"/><path style={{fill: "#8CA532"}} d="M22.84,59.96c0.78-1.11,2.31-1.37,3.42-0.6c1.11,0.78,1.37,2.31,0.6,3.42c-3.36,4.76-5.29,9.7-5.56,14.82 c-0.27,5.13,1.12,10.56,4.41,16.29c0.67,1.18,0.27,2.68-0.91,3.35c-1.18,0.67-2.68,0.27-3.35-0.91c-3.77-6.58-5.36-12.9-5.04-18.98 C16.71,71.25,18.94,65.47,22.84,59.96L22.84,59.96L22.84,59.96z"/></g></svg>
                </div>
                <div style={{width: '10px'}}></div>
                <h1 style={{cursor: 'pointer'}}><span className="homeIcon">Pear</span>Code</h1>
            </div>
        </Link>
    )
}
