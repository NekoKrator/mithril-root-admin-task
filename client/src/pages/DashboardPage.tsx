import UsersDashboard from '../components/UsersDashboard'

export default function Dashboard() {
    return (
        <div>
            <ul>
                <UsersDashboard />
                <li>
                    <div>ID: <span>2</span></div>
                    <div>Email: <span>user@gmail.com</span></div>
                    <div>Name: <span>User Name</span></div>
                    <div>Role: <span>User</span></div>
                </li>
            </ul>
        </div>
    )
}