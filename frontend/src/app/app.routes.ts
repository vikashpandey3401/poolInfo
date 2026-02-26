import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { BalanceComponent } from './wallet/balance/balance.component';
import { TransactionsComponent } from './wallet/transactions/transactions.component';
import { TradeComponent } from './wallet/trade/trade.component';
import { PoolComponent } from './wallet/pool/pool.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'wallet',
                children: [
                    { path: '', redirectTo: 'balance', pathMatch: 'full' },
                    { path: 'balance', component: BalanceComponent },
                    { path: 'transactions', component: TransactionsComponent },
                    { path: 'trade', component: TradeComponent },
                    { path: 'pool', component: PoolComponent }
                ]
            }
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
