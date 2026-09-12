// Abstract submission adapter — corrections and right-of-reply submissions
// never publish automatically (see CONTENT-GUIDE.md). This mock adapter
// stores submissions in localStorage only, for local review. A future
// adapter (email, serverless function, database) implements the same
// interface: async submit(kind, payload) -> { id, receivedAt }.
(function (root) {
  const STORAGE_KEY = "bwwr:submissions";

  function readAll() {
    try {
      return JSON.parse(root.localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function writeAll(all) {
    root.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  const mockAdapter = {
    // kind: 'correction' | 'right_of_reply'
    // payload: plain object of form fields, already validated by the caller
    async submit(kind, payload) {
      const all = readAll();
      const record = {
        id: kind + "-" + all.length + 1,
        kind,
        payload,
        receivedAt: new Date().toISOString(),
        publicationStatus: "pending_review",
      };
      all.push(record);
      writeAll(all);
      return { id: record.id, receivedAt: record.receivedAt };
    },
  };

  root.SubmissionsAdapter = mockAdapter;
})(typeof window !== "undefined" ? window : this);
