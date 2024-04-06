export default function Profile({ params }: { params: { user: string } }) {
  if (!params.user) {
    // Fetch user data and redirect to /profile/firstname.lastname
  }
  return <div>profile</div>;
}
