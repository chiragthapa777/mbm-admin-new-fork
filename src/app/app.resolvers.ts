import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service';
import { from, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { InitialData } from './app.types';
import { Permission, User } from './core/user/user.types';
import { ROLE_ENUM } from './enums/role.enum';
import { defaultNavigation } from './mock-api/common/navigation/data';
import { UserAuthService } from './services/user.auth.service';

export const initialDataResolver = () => {
    // const quickChatService = inject(QuickChatService);
    const shortcutsService = inject(ShortcutsService);
    const _httpClient = inject(HttpClient);
    const userAuthService = inject(UserAuthService);

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     * @param route
     * @param state
     */
    function resolve(): Observable<InitialData> {
        return from(fetchData());
    }

    function getNavigation(
        lists: FuseNavigationItem[],
        permission: Permission[]
    ): FuseNavigationItem[] {
        return lists.filter((n) =>
            n.subject.every((d) =>
                permission.find(
                    (p) => p.subject === d && (p.ALL_ACTION || p.READ_ACTION)
                )
            )
        );
    }

    async function fetchData(): Promise<any> {
        // Replace with the URL of your REST API
        let jsonData: FuseNavigationItem[] = [];
        const user = _httpClient.get<any>(environment.baseUrl + 'users/me');

        const aaa: User = await user.toPromise();
        userAuthService.setUser(aaa);
        jsonData =
            aaa.isAdmin || aaa.role === ROLE_ENUM.ADMIN
                ? defaultNavigation
                : getNavigation(defaultNavigation, aaa.permissions);

        const navigation = jsonData;
        return {
            navigation: {
                default: navigation,
            },
            notifications: [],
            shortcuts: [],
            user: aaa,
        };
    }

    // Fork join multiple API endpoint calls to wait all of them to finish
    return resolve();
};
