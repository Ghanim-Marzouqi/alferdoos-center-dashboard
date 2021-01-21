import { date } from 'quasar';
import { ERRORS } from '../config/constants';

const downloadDocument = (name, fileURL) => {
    let status = '';
    let isError = false;

    try {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
            var blob = xhr.response;
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `${name}_${date.formatDate(
                Date.now(),
                "YYYY_MM_DD_HH_mm_ss_a"
            )}`;
            link.click();
        };
        xhr.open("GET", fileURL);
        xhr.send();

        isError = false;
        status = 'DOWNLOAD_COMPLETE';
    } catch (error) {
        isError = true;
        switch (error.code) {
            case ERRORS.STORAGE.OBJECT_NOT_FOUND:
                status = ERRORS.STORAGE.OBJECT_NOT_FOUND;
                break;
            case ERRORS.STORAGE.UNAUTHORIZED:
                status = ERRORS.STORAGE.UNAUTHORIZED;
                break;
            case ERRORS.STORAGE.CANCELED:
                status = ERRORS.STORAGE.CANCELED;
                break;
            case ERRORS.STORAGE.UNKNOWN:
                status = ERRORS.STORAGE.UNKNOWN;
                break;
        }
    }

    return { status, isError };
}

export { downloadDocument };