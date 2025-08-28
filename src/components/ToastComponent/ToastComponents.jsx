import styles from './ToastComponents.module.css'
import { Toast, ToastHeader, ToastBody } from 'react-bootstrap';
export default function SingleButtonToast({title, description, show, buttontxt, onclick}){
    return <Toast show={show} className='bg-dark text-white btn-close-white mt-2'>
        <ToastHeader className='bg-dark d-flex align-items-center'>
            <div className={`${styles.ToastStartDecorator}`}></div>
            <div className='me-auto'>{title}</div>
        </ToastHeader>
        <ToastBody>{description}</ToastBody>
        <div className='toastFooter w-100 d-flex'>
            <button className='ms-auto btn btn-primary me-3 mb-3 focus-ring' onClick={e => {onclick();}}>{buttontxt}</button>
        </div>
    </Toast>
}