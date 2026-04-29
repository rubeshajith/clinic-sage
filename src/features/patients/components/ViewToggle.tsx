import { LayoutGrid, List } from 'lucide-react';
import styles from './ViewToggle.module.css';

interface Props {
  mode: 'grid' | 'list';
  onChange: (mode: 'grid' | 'list') => void;
}

export default function ViewToggle({ mode, onChange }: Props) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.btn} ${mode === 'grid' ? styles.active : ''}`}
        onClick={() => onChange('grid')}
        title="Grid view"
      >
        <LayoutGrid size={16} strokeWidth={1.6} />
        <span>Grid</span>
      </button>
      <button
        className={`${styles.btn} ${mode === 'list' ? styles.active : ''}`}
        onClick={() => onChange('list')}
        title="List view"
      >
        <List size={16} strokeWidth={1.6} />
        <span>List</span>
      </button>
    </div>
  );
}
