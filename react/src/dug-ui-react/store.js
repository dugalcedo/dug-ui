import { atom } from 'jotai'

export const modalAtom = atom({
    id: null,
    head: null,
    onCancel: () => {},
    onConfirm: () => {}
})