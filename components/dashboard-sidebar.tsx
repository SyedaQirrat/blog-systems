// components/dashboard-sidebar.tsx
import Link from 'next/link';
import styles from './dashboard-sidebar.module.css'; // Correct import path

const DashboardSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <ul>
        <li>
          <Link href="/dashboard">
            <div>
              <span className={styles.icon}>🏠</span>
              <span className={styles.sidebarText}>Dashboard</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/posts">
            <div>
              <span className={styles.icon}>📄</span>
              <span className={styles.sidebarText}>Posts</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/settings">
            <div>
              <span className={styles.icon}>⚙️</span>
              <span className={`${styles.sidebarText} ${styles.settingsText}`}>
                Settings
              </span>
            </div>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default DashboardSidebar;