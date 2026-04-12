

## Plan: Default to no candidates selected

**File: `src/pages/Index.tsx`**

Change the initial state of `selectedInternalIds` from selecting all candidates to an empty array:

```ts
// Before
const [selectedInternalIds, setSelectedInternalIds] = useState<string[]>(() => internalPool.map((c) => c.id));

// After
const [selectedInternalIds, setSelectedInternalIds] = useState<string[]>([]);
```

Also update `handleNewSearch` to reset to empty instead of all selected:

```ts
// Before
setSelectedInternalIds(internalPool.map((c) => c.id));

// After
setSelectedInternalIds([]);
```

