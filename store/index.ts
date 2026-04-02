import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/auth.slice";
import dashboardReducer from "./slice/dashboard.slice";
import userManagementSlice from "./slice/userManagement.slice";
import invite from "./slice/invite.slice"
import settings from "./slice/setting.slice"
import masterModuleSlice from "./slice/masterModule.slice"
import menuReducer from "./slice/menu.slice"
import dynamicModuleReducer from "./slice/dynamicModule.slice"
import settingReducer from "./slice/settings.slice"

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
const rootReducer = combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    userManagement: userManagementSlice,
    invite: invite,
    settings: settings,
    masterModule: masterModuleSlice,
    menu: menuReducer,
    dynamicModule: dynamicModuleReducer,
    setting: settingReducer
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;