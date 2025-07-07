import React, { useCallback } from "react";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";

export default function ParticleBackground({fullScreen = true, role = 0}) {
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    const getColorScheme = (role) => {
        switch(role) {
            case 1: // 管理员 - 蓝色系
                return {
                    colors: ["#1890ff", "#40a9ff", "#69c0ff", "#91d5ff", "#bae7ff"],
                    linkColor: "#1890ff",
                    background: "#f0fffc"
                };
            case 2: // 心理咨询师 - 紫色系
                return {
                    colors: ["#722ed1", "#9254de", "#b37feb", "#d3adf7", "#efdbff"],
                    linkColor: "#722ed1",
                    background: "#f9f0ff"
                };
            default: // 普通用户 - 蓝绿渐变色系
                return {
                    colors: ["#1890ff", "#36cfc9", "#13c2c2", "#52c41a", "#73d13d"],
                    linkColor: "#1890ff",
                    background: "linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)"
                };
        }
    };

    const colorScheme = getColorScheme(role);

    const getParticleConfig = (role) => {
        switch(role) {
            case 1: // 管理员 - 更多粒子，体现权威感
                return {
                    particleCount: 100,
                    speed: 1.5,
                    linkDistance: 120,
                    repulseDistance: 120
                };
            case 2: // 心理咨询师 - 温和的动画效果
                return {
                    particleCount: 60,
                    speed: 0.8,
                    linkDistance: 140,
                    repulseDistance: 100
                };
            default: // 普通用户 - 标准配置
                return {
                    particleCount: 80,
                    speed: 1,
                    linkDistance: 150,
                    repulseDistance: 100
                };
        }
    };

    const particleConfig = getParticleConfig(role);

    return (
        <Particles
            id={`tsparticles-role-${role}`}
            init={particlesInit}
            options={{
                fullScreen: { enable: fullScreen },
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: role === 1 ? 6 : 4, // 管理员点击产生更多粒子
                        },
                        repulse: {
                            distance: particleConfig.repulseDistance,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: colorScheme.colors,
                    },
                    links: {
                        color: colorScheme.linkColor,
                        distance: particleConfig.linkDistance,
                        enable: true,
                        opacity: role === 2 ? 0.2 : 0.3, // 咨询师界面更柔和
                        width: role === 1 ? 1.5 : 1, // 管理员界面连线更粗
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: particleConfig.speed,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: particleConfig.particleCount,
                    },
                    opacity: {
                        value: role === 2 ? 0.4 : 0.5, // 咨询师界面更透明
                        random: true,
                        animation: {
                            enable: true,
                            speed: role === 1 ? 1.2 : 1, // 管理员界面动画稍快
                            minimumValue: role === 2 ? 0.05 : 0.1, // 咨询师界面最小透明度更低
                            sync: false,
                        },
                    },
                    shape: {
                        type: role === 1 
                            ? ["circle", "triangle", "polygon"] // 管理员：几何形状体现权威
                            : role === 2 
                            ? ["circle", "star"] // 咨询师：圆形和星形体现温暖
                            : ["circle", "triangle", "star"], // 普通用户：多样化
                    },
                    size: {
                        value: { 
                            min: role === 1 ? 1.5 : 1, 
                            max: role === 1 ? 6 : 5 
                        }, // 管理员粒子稍大
                        random: true,
                        animation: {
                            enable: true,
                            speed: role === 2 ? 1.5 : 2, // 咨询师界面大小变化更温和
                            minimumValue: 0.1,
                            sync: false,
                        },
                    },
                    // 为不同角色添加特殊效果
                    ...(role === 1 && {
                        // 管理员：添加轻微的旋转效果
                        rotate: {
                            value: 0,
                            random: true,
                            direction: "clockwise",
                            animation: {
                                enable: true,
                                speed: 5,
                                sync: false,
                            },
                        },
                    }),
                    ...(role === 2 && {
                        // 咨询师：添加柔和的闪烁效果
                        twinkle: {
                            particles: {
                                enable: true,
                                frequency: 0.05,
                                opacity: 0.8,
                            },
                        },
                    }),
                },
                detectRetina: true,
                pauseOnBlur: true,
                pauseOnOutsideViewport: true,
            }}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "none"
            }}
        />
    );
};