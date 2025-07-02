import React, { useState, useEffect } from "react";

export default function FloatingElements() {
    return (
        <>
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(135, 208, 104, 0.1) 100%)',
                borderRadius: '50%',
                zIndex: 0,
                animation: 'float 6s ease-in-out infinite'
            }} />
            
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, rgba(255, 120, 117, 0.1) 0%, rgba(250, 173, 20, 0.1) 100%)',
                borderRadius: '50%',
                zIndex: 0,
                animation: 'float 8s ease-in-out infinite reverse'
            }} />
            
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '10%',
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, rgba(135, 208, 104, 0.08) 0%, rgba(24, 144, 255, 0.08) 100%)',
                borderRadius: '50%',
                zIndex: 0,
                animation: 'float 10s ease-in-out infinite'
            }} />
            
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </>
    )
}