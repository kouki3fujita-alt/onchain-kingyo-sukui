// Mock implementation of AntigravitySDK for development
class MockAntigravitySDK {
    appId: string;
    network: string;

    constructor(config: any) {
        this.appId = config.appId;
        this.network = config.network;
        console.log("Mock Antigravity SDK Initialized", config);
    }

    async init() {
        console.log("Mock Antigravity SDK init called");
        return true;
    }
}

const appId = import.meta.env.VITE_APP_ID || 'mock-app-id';

export const antigravity = new MockAntigravitySDK({
    appId: appId,
    network: 'base-mainnet',
    enableSmartWallet: true,
    paymasterEnabled: true
});

export async function initializeAntigravity() {
    try {
        await antigravity.init();
        return antigravity;
    } catch (e) {
        console.error("Failed to init antigravity", e);
        return null;
    }
}
