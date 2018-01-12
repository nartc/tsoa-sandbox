import { ReplaySubject } from 'rxjs/ReplaySubject';

import {NgRedux} from '@angular-redux/store';

export type PropertySelector = string | number | symbol;
export type PathSelector = (string | number)[];
export type FunctionSelector<RootState, S> = ((s: RootState) => S);
export type Comparator = (x: any, y: any) => boolean;
export type PropertyDecorator = (target: any, propertyKey: string) => void;

export function Subscribe<T> (selector?: any, comparator?: Comparator): PropertyDecorator {
    return function decorate (target: any, key: string): void {
        let bindingKey = selector.__propertyPath ? selector.__propertyPath : selector;
        let valueKey: string;
        let valuePrivateKey: string;

        let observableKey: string;
        let observableKeyPrivateKey: string;

        let observableKeySub: string;

        if (key.lastIndexOf('$') === key.length - 1) {
            observableKey = key;
            valueKey = key.substr(0, key.length - 1);
        } else {
            valueKey = key;
            observableKey = key + '$';
        }
        valuePrivateKey = '_' + valueKey;
        observableKeyPrivateKey = '_' + observableKey;
        observableKeySub = observableKeyPrivateKey + 'Sub';

        Object.defineProperty(target, valueKey, {
            get: function (): T {
                return this[observableKey] && this[valuePrivateKey];
            },
            set: function (value) {
                this[valuePrivateKey] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(target, observableKey, {
            get: function () {
                if (this[observableKeyPrivateKey]) {
                    return this[observableKeyPrivateKey];
                }
                let observable = NgRedux.instance.select(bindingKey, comparator);
                let subject = new ReplaySubject<any>(1);
                this[observableKeySub] = observable.subscribe(subject);
                this[observableKeyPrivateKey] = subject;
                subject.subscribe((v) => this[valuePrivateKey] = v);
                return this[observableKeyPrivateKey];
            },
            enumerable: true,
            configurable: true
        });

        let ngDestroy = target.ngOnDestroy;
        target.ngOnDestroy = function () {
            ngDestroy && ngDestroy.call(this);
            this[observableKeySub] && this[observableKeySub].unsubscribe()
        };
    };
}