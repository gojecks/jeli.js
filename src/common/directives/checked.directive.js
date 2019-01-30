/**
 * @directive :checked
 * checks required element if condition is met.
 */
commonModule
    .directive({
        selector: ':checked',
        DI: ['ElementRef', 'Observables'],
        props: [{
            name: 'binding',
            value: ':checked'
        }]
    }, CheckedDirective);

function CheckedDirective(elementRef, Observables) {
    this.init = function() {
        Observables
            .observeForKey(this.binding, function(value) {
                if (value) {
                    elementRef.setAttribute('checked', 'true', true);
                } else {
                    elementRef.removeAttribute('checked');
                }
            });
    };
}