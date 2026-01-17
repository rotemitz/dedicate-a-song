import { motion } from 'framer-motion';

const OrderSelectionScreen = ({ onSelect }) => {
    const options = [
        {
            id: 'emotional',
            title: 'מסע רגשי',
            icon: '💫',
            description: 'מתחילים קל ובונים לשיא',
        },
        {
            id: 'random',
            title: 'הפתעה!',
            icon: '🎲',
            description: 'סדר אקראי מלא הפתעות',
        },
        {
            id: 'close_first',
            title: 'קרובים קודם',
            icon: '💕',
            description: 'מתחילים מהאנשים הכי קרובים',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    return (
        <section className="order-selection-screen" dir="rtl">
            <div className="order-selection-content">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="order-selection-header"
                >
                    <div className="sparkle-container">
                        <span className="sparkle">✨</span>
                        <span className="sparkle">✨</span>
                        <span className="sparkle">✨</span>
                    </div>
                    <h1 className="order-selection-title">איך את רוצה לחגוג?</h1>
                    <p className="order-selection-subtitle">בחרי את הסדר שבו תצפי בברכות</p>
                </motion.div>

                <motion.div
                    className="order-options-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {options.map((option) => (
                        <motion.button
                            key={option.id}
                            className="order-option-card"
                            variants={itemVariants}
                            onClick={() => onSelect(option.id)}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="option-icon">{option.icon}</span>
                            <span className="option-title">{option.title}</span>
                            <span className="option-description">{option.description}</span>
                        </motion.button>
                    ))}
                </motion.div>
            </div>

            <div className="order-selection-footer">
                Made with ❤️ for you
            </div>
        </section>
    );
};

export default OrderSelectionScreen;
