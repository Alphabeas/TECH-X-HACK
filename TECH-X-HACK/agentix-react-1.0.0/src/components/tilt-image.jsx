import { useRef, useState } from 'react';
import { useMotionValue, useSpring, motion } from 'framer-motion';

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

export default function TiltedImage({ rotateAmplitude = 3, }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });

    const [lastY, setLastY] = useState(0);

    function handleMouse(e) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);

        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);

        const velocityY = offsetY - lastY;
        rotateFigcaption.set(-velocityY * 0.6);
        setLastY(offsetY);
    }

    function handleMouseLeave() {
        rotateX.set(0);
        rotateY.set(0);
        rotateFigcaption.set(0);
    }

    return (
        <motion.figure ref={ref} className="relative w-full h-full [perspective:800px] mt-16 max-w-5xl mx-auto flex flex-col items-center justify-center" onMouseMove={handleMouse} onMouseLeave={handleMouseLeave}
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
            <motion.div className="relative [transform-style:preserve-3d] w-full max-w-5xl" style={{ rotateX, rotateY }} >
                <img
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1400&auto=format&fit=crop"
                    className="w-full rounded-[22px] border border-slate-200 shadow-2xl will-change-transform [transform:translateZ(0)]"
                    alt="career roadmap workspace"
                />
                <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 border border-slate-200 p-4 shadow-lg">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Vibe-Check Snapshot</p>
                    <p className="font-display text-lg text-slate-900 mt-1">3 gaps flagged · 5 actions queued · 2 wins this week</p>
                </div>
            </motion.div>
        </motion.figure>
    );
}