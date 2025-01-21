import { transition, trigger , animate, style} from "@angular/animations";

export const routeAnimationsState = trigger('routeAnimationTrigger', [
    transition(':enter', [
        style({
            opacity: 0,
            transform: 'translateX(-100%)',
        }),
        animate(
            '800ms ease-out',
            style({
                opacity: 1,
                transform: 'translateX(0)',
            })
        ),
    ]),
    transition(':leave', [
        animate(
            '800ms ease-in',
            style({
                opacity: 0,
                transform: 'translateX(100%)',
            })
        ),
    ]),
]);

/* 
export const songDeleteTrigger = trigger('songDeleteTrigger', [
    transition(':enter', [
        style({
            opacity: 0,
        }),
        animate(500),
    ]),
    transition(':leave', [
        animate(
            500,
            style({
                opacity: 0,
            })
        ),
    ]),
]); */


export default routeAnimationsState;