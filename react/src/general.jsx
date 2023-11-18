import { useRef, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Alert from '@mui/material/Alert';

export const captions = {
    edit_menu_item: 'Редагувати',
    delete_menu_item: 'Видалити',
    delete_confirmation: 'Ви дійсно хочете видалити пост?',
    back_btn: 'Назад',
    blog_menu_item: 'Новини',
    post_update_success_msg: 'Статтю успішно оновлено',
    users_menu_item: 'Користувачі',
    logout_menu_item: 'Вийти',
    add_comment_btn: 'Додати коментар',
    comment_author_label: 'Автор',
    comment_text_label: 'Коментар'
};

export const links = {
    post_new: '/post/new',
    post_photo: '/image.jpg',
    post_show_route: '/post/show/',
    post_edit_route: '/post/edit/',
    post_delete_route: '/post/',
    post_index: '/post/'
};
  
export const _ = (key) => {
    return captions[key];
}

export function useAlert(){
    const [message, setMessage] = useState();
    const [open, setOpen] = useState();
    const [type, setType] = useState();

    const showAlert = (message, type) => {
        setMessage(message);
        setType(type);
        setOpen(true);
    }

    const hideAlert = () => { setOpen(false) };

    return {message, type, open, showAlert, hideAlert}
}

function SnackbarAlert({message, type, open, onClose}){
    if (!open) {
        return null;
    }

    return(
        <Snackbar
            sx={{ marginTop: '8ch' }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={ open }
            autoHideDuration={3000} // Adjust the duration as needed
            onClose={onClose}
            TransitionComponent={Fade}
        >
            <Alert onClose={() => onClose()} variant="filled" severity={type}>{ message }</Alert>
        </Snackbar>
    );
}

export default SnackbarAlert;