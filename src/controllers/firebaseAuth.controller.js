class FirebaseAuth {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://identitytoolkit.googleapis.com/v1";
  }

  async signUp(email, password) {
    console.log('this.apiKey', this.apiKey);    
    const url = `${this.baseUrl}/accounts:signUp?key=${this.apiKey}`;
    return this.#sendAuthRequest(url, email, password);
  }

  async signIn(email, password) {
    const url = `${this.baseUrl}/accounts:signInWithPassword?key=${this.apiKey}`;
    return this.#sendAuthRequest(url, email, password);
  }

  async #sendAuthRequest(url, email, password) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Authentication failed");
      }

      return {
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        localId: data.localId,
        email: data.email
      };
    } catch (err) {
      return { error: err.message };
    }
  }
}

module.exports = FirebaseAuth;
