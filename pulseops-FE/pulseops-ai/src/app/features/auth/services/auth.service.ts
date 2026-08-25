import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface LoginRequest {
    email: string,
    password: string
}

export interface TokenResponse {
    access_token: string,
    token_type: string
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient) {}

    login(credentials: LoginRequest): Observable<TokenResponse> {
        return this.http.post<TokenResponse>(
            `${this.apiUrl}/login`,
            credentials
        );
    }

    logout(): void {
        sessionStorage.removeItem('access_token');
    }
}
