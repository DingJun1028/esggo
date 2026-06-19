
try {
    console.log('Checking import.meta.env...');
    // @ts-ignore
    console.log('import.meta.env:', typeof import.meta.env !== 'undefined' ? 'Defined' : 'Undefined');
} catch (e) {
    console.log('import.meta.env is inaccessible');
}

try {
    console.log('Checking localStorage...');
    console.log('localStorage:', typeof localStorage !== 'undefined' ? 'Defined' : 'Undefined');
} catch (e) {
    console.log('localStorage is inaccessible');
}
