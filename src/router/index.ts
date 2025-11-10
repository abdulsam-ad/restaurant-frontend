import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

// Layouts
import OwnerLayout from "../layouts/OwnerLayout.vue";
import SuperLayout from '../layouts/SuperLayout.vue'

// Pages
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import EmailConfirmation  from "../views/EmailConfirmation.vue";
import AccountActivation from '../views/AccountActivation.vue'

import OwnerDashboard from "../views/owner/Dashboard.vue";
import MenuPage from "../views/owner/menu/MenuPage.vue";
import MenuDetail from "../views/owner/menu/MenuDetail.vue";
import OrdersPage from "../views/owner/OrdersPage.vue";
// import ProfilePage from "../views/owner/ProfilePage.vue";

import SuperDashboard from '../views/superadmin/Dashboard.vue'
import Users from '../views/superadmin/Users.vue'
import Restaurants from '../views/superadmin/Restaurants.vue'
import UserDashboard from "../views/user/UserDashboard.vue";
import RestaurantDetails from "../views/superadmin/RestaurantDetails.vue";
import UserDetails from "../views/superadmin/UserDetails.vue";
import Settings from '../views/superadmin/Settings.vue';
import Notifications from '../views/superadmin/Notifications.vue';

import WaiterDashboard from "../views/waiter/WaiterDashboard.vue";
import MenuBuilder from "../views/owner/menu/MenuBuilder.vue";


const routes: RouteRecordRaw[] = [
    { path: '/', name: 'Login', component: Login },
    { path: '/login', name: 'LoginPage', component: Login },
    { path: '/signup', name: 'Signup', component: Signup },
    { path: '/email-confirmation', name: 'EmailConfirmation', component: EmailConfirmation, },
    { path: '/api/user/account-activation/:token', name: 'AccountActivation', component: AccountActivation, },

    {
        path: '/user',
        component: UserDashboard,
        children: [
            {path: "", name: "UserDashboard", component: UserDashboard},
        ]
    },

    {
        path: '/waiter',
        component: WaiterDashboard,
        children: [
            {path: "", name: "WaiterDashboard", component: WaiterDashboard},
        ]
    },

    {
        path: "/owner",
        component: OwnerLayout,
        children: [
            {path: "", name: "OwnerDashboard", component: OwnerDashboard},
            {path: "menu", name: "MenuPage", component: MenuPage},
            {path: "menu-builder", name: "MenuBuilder", component: MenuBuilder},
            {path: "menu-detail/:id", name: "MenuDetail", component: MenuDetail},
            {path: "orders", name: "OrdersPage", component: OrdersPage},
            {path: "profile", name: "ProfilePage", component: Settings},
            {path: "notifications", name: "OwnerNotifications", component: Notifications,}
        ],
    },

    {
        path: '/super',
        component: SuperLayout,
        children: [
            { path: '', name: 'Dashboard', component: SuperDashboard },
            { path: 'users', name: 'Users', component: Users },
            { path: 'restaurants', name: 'Restaurants', component: Restaurants },
            { path: 'users/:username', name: 'UserDetails', component: UserDetails, },
            { path: 'restaurants/:id', name: 'RestaurantsDetails', component: RestaurantDetails, },
            { path: "profile", name: "Settings", component: Settings, },
            { path: "notifications", name: "Notifications", component: Notifications, }
        ]
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
