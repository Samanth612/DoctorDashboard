// AuthReducer.ts
interface AuthState {
  isLoggedIn: boolean;
  loginLoading: boolean;
}

type AuthAction = { type: "userLoggedIn" } | { type: "userLoggedOut" };

export default function AuthReducer(
  state: AuthState = { isLoggedIn: false, loginLoading: false },
  action: AuthAction
): AuthState {
  switch (action.type) {
    case "userLoggedIn":
      return { isLoggedIn: true, loginLoading: false };
    case "userLoggedOut":
      return { isLoggedIn: false, loginLoading: false };
    default:
      return state;
  }
}
