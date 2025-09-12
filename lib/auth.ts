// This is a mock function to simulate fetching user data.
export async function getMockUser() {
  // To test different roles, change the value below to:
  // 'Admin', 'Editor', or 'Author/Writer'
  const role = "Admin"; 

  return {
    name: "Sadek Hossen",
    email: "sadek@example.com",
    role: role as "Admin" | "Editor" | "Author/Writer",
  };
}