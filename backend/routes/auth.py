
@router.post("/refresh", response_model=TokenResponse)
def refresh_token(current_user: User = Depends(get_current_active_user)) -> Any:
    """
    Refresh access token. Note: In a real system, the client sends the refresh token in the header or cookie.
    Here we expect the refresh token in the Authorization header.
    """
    access_token = create_access_token(data={"sub": str(current_user.id), "role": current_user.role})
    refresh_token = create_refresh_token(data={"sub": str(current_user.id), "role": current_user.role})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
