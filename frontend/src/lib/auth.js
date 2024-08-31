'use server';

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function register(formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const { error, message } = await response.json();
        if( error ){
            return { status: "error", message };
        }else{
            return { status: "success", message };
        }

    } catch (error) {
        console.error('Error during registration:', error);
        return { status: "error", message: "Registration process failed" };
    }
}

export async function login(formData, rememberUser) {
    const email = formData.get("email");
    const password = formData.get("password");
    
    try {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, rememberUser }),
        });

        if (!response.ok) {
            return {
                ok: false,
                message: "Login failed"
            };
        }

        const { token, expires, message } = await response.json();
        if(message) return { ok: false, message };
        if( !token || !expires )  return { ok: false, message: "Login failed" };

        cookies().set("session", token, { expires: new Date(expires), httpOnly: true });
        return {
            ok: true,
            message: "Login successful"
        };

    } catch (error) {
        console.error('Error during login:', error);
        return {
            ok: false,
            message: "An error occurred during login"
        };
    }
}

export async function logout() {
    const sessionToken = cookies().get("session")?.value;

    try {
        if (sessionToken) {
            await fetch(`${BACKEND_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${sessionToken}`,
                },
            });
        }

        cookies().set("session", "", { expires: new Date(0) });

    } catch (error) {
        console.error('Error during logout:', error);
    }
}

export async function getSession() {
    const sessionToken = cookies().get("session")?.value;
    if (!sessionToken) return null;

    try {
        const response = await fetch(`${BACKEND_URL}/auth/session`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionToken}`,
            },
        });

        if (!response.ok) {
            return null;
        }

        const session = await response.json();
        return session;

    } catch (error) {
        console.error('Error during session retrieval:', error);
        return null;
    }
}

export async function updateSession(request) {
    const sessionToken = request.cookies.get("session")?.value;
    if (!sessionToken) return;

    try {
        const response = await fetch(`${BACKEND_URL}/auth/session`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${sessionToken}`,
            },
        });

        if (!response.ok) {
            return;
        }

        const { token, expires } = await response.json();

        const res = NextResponse.next();
        res.cookies.set({
            name: "session",
            value: token,
            httpOnly: true,
            expires: new Date(expires),
        });
        return res;

    } catch (error) {
        console.error('Error during session update:', error);
        return;
    }
}

export async function editPassword(formdata){
    const email = formdata.get("email");
    const password = formdata.get("password");
    const currentPassword = formdata.get("currentPassword");
    try {
        const response = await fetch(`${BACKEND_URL}/auth/edit-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, currentPassword }),
        });

        if (!response.ok) {
            return { status: "error", message: "Failed to edit password" };
        }
        const { error, message } = await response.json();
        if( error ){
            return { status: "error", message };
        }else{
            return { status: "success", message };
        }

    } catch (error) {
        console.error('Error during password edit:', error);
        return { status: "error", message: "Failed to edit password" };
    }
}

export async function requestPasswordReset(email) {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/reset-password/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            return { status: "error", message: "Failed to send reset email" };
        }

        return { status: "success", message: "Password reset email sent successfully" };

    } catch (error) {
        console.error('Error during password reset request:', error);
        return { status: "error", message: "Failed to send reset email" };
    }
}

export async function validatePasswordResetToken(token) {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/reset-password/validate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            return { status: "error", message: "Invalid token", valid: false };
        }

        return { status: "success", message: "Valid token", valid: true };

    } catch (error) {
        console.error('Error during token validation:', error);
        return { status: "error", message: "Error during token validation", valid: false };
    }
}

export async function resetPassword({ token, newPassword }) {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/reset-password/confirm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password: newPassword }),
        });

        if (!response.ok) {
            return { status: "error", message: "Failed to reset password" };
        }

        return { status: "success", message: "Password reset successful" };

    } catch (error) {
        console.error('Error during password reset:', error);
        return { status: "error", message: "Failed to reset password" };
    }
}