import { toast } from 'sonner';

const alert = {
  success(message, options = {}) {
    return toast.success(message, {
      description: options.description,
      duration: options.duration ?? 4000,
      ...options,
    });
  },

  error(message, options = {}) {
    return toast.error(message, {
      description: options.description,
      duration: options.duration ?? 5000,
      ...options,
    });
  },

  warning(message, options = {}) {
    return toast.warning(message, {
      description: options.description,
      duration: options.duration ?? 4000,
      ...options,
    });
  },

  info(message, options = {}) {
    return toast.info(message, {
      description: options.description,
      duration: options.duration ?? 4000,
      ...options,
    });
  },

  confirm(message, options = {}) {
    const {
      description,
      confirmLabel = 'Ya',
      cancelLabel = 'Batal',
      onConfirm = () => {},
      onCancel = () => {},
      ...rest
    } = options;

    return toast(message, {
      description,
      duration: Infinity,
      position: 'top-center',
      action: {
        label: confirmLabel,
        onClick: onConfirm,
      },
      cancel: {
        label: cancelLabel,
        onClick: onCancel,
      },
      ...rest,
    });
  },
};

export default alert;
