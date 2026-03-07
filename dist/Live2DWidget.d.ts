declare const BUILT_IN_MODELS: readonly ["histoire", "bilibili-22", "bilibili-33", "cat-black", "cat-white", "chino", "date", "ganyu", "hallo", "haruto", "hibiki", "HK416-1-normal", "HK416-2-destroy", "HK416-2-normal", "Kar98k-normal", "kobayaxi", "koharu", "kp31", "live_uu", "mai", "murakumo", "Pio", "platelet", "platelet_2", "potion-Maker-Pio", "rem", "rem_2", "senko", "shizuku", "shizuku_48", "shizuku_pajama", "terisa", "tia", "umaru", "uni", "wed_16", "xisitina", "z16"];
export type ModelName = typeof BUILT_IN_MODELS[number] | (string & {});
export type Live2DWidgetProps = {
    /** Tên model (bắt buộc nếu không dùng random) */
    modelName?: ModelName;
    /** Custom base URL để load models (mặc định: GitHub raw) */
    baseUrl?: string;
    /** CSS classes */
    className?: string;
    /** Inline styles */
    style?: React.CSSProperties;
    /** Vị trí widget: 'left' | 'right' */
    position?: 'left' | 'right';
    /** Chiều rộng widget (px) */
    width?: number;
    /** Chiều cao widget (px) */
    height?: number;
    /** Độ trong suốt mặc định (0-1) */
    opacity?: number;
    /** Độ trong suốt khi hover (0-1) */
    hoverOpacity?: number;
    /** Hiển thị trên mobile */
    showOnMobile?: boolean;
    /** Chọn model ngẫu nhiên */
    random?: boolean;
    /** Callback khi load xong */
    onLoad?: () => void;
    /** Callback khi có lỗi */
    onError?: (error: Error) => void;
    /** Callback khi click vào widget */
    onClick?: () => void;
    /** Component hiển thị khi đang load */
    fallback?: React.ReactNode;
};
export default function Live2DWidget({ modelName, baseUrl, style, className, position, width, height, opacity, hoverOpacity, showOnMobile, random, onLoad, onError, onClick, fallback, }: Live2DWidgetProps): import("react/jsx-runtime").JSX.Element;
export { BUILT_IN_MODELS };
export declare const getRandomModel: () => ModelName;
