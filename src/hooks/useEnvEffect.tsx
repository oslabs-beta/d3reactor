import React, { useEffect, useLayoutEffect } from 'react';
const hook = typeof window === 'undefined' ? useEffect : useLayoutEffect;
export default hook;
