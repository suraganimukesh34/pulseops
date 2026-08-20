import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { Observable } from "rxjs";

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
    private readonly apiUrl = 'http://127.0.0.1:8000/auth';

    constructor(private http: HttpClient) {}

    login(credentials: LoginRequest): Observable<TokenResponse> {
        return this.http.post<TokenResponse>(
            `${this.apiUrl}/login`,
            credentials
        );
    }
}