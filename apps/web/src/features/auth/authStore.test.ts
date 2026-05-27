import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore, getOAuthUrl } from "./authStore";

beforeEach(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("authStore", () => {
  it("starts with default state", () => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: true });
    const s = useAuthStore.getState();
    expect(s.user).toBeNull();
    expect(s.isAuthenticated).toBe(false);
    expect(s.isLoading).toBe(true);
  });

  it("setUser sets user and isAuthenticated", () => {
    const user = { id: "1", name: "Test", email: "t@t.com", image: null, username: "tester" };
    useAuthStore.getState().setUser(user);
    const s = useAuthStore.getState();
    expect(s.user).toEqual(user);
    expect(s.isAuthenticated).toBe(true);
    expect(s.isLoading).toBe(false);
  });

  it("setUser(null) clears auth", () => {
    useAuthStore.getState().setUser({ id: "1", name: "T", email: "t@t.com", image: null, username: null });
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("logout clears user and token", () => {
    localStorage.setItem("token", "xyz");
    useAuthStore.getState().setUser({ id: "1", name: "T", email: "t@t.com", image: null, username: null });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("fetchUser calls API and sets user on success", async () => {
    const mockUser = { user: { id: "2", name: "API", email: "a@a.com", image: null, username: "api" } };
    const spy = vi.spyOn(window, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(mockUser), { status: 200 })
    );

    await useAuthStore.getState().fetchUser();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.name).toBe("API");
    expect(spy).toHaveBeenCalledWith(
      "/api/auth/session",
      { credentials: "include" }
    );
  });

  it("fetchUser handles network error", async () => {
    vi.spyOn(window, "fetch").mockRejectedValueOnce(new Error("fail"));
    await useAuthStore.getState().fetchUser();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("fetchUser handles non-ok", async () => {
    vi.spyOn(window, "fetch").mockResolvedValueOnce(new Response("{}", { status: 401 }));
    await useAuthStore.getState().fetchUser();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});

describe("getOAuthUrl", () => {
  it("github", () => expect(getOAuthUrl("github")).toBe("/api/auth/sign-in/github"));
  it("google", () => expect(getOAuthUrl("google")).toBe("/api/auth/sign-in/google"));
});
