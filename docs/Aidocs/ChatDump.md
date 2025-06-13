Pawel@LAPTOP-C4448CI9 MINGW64 ~/Hrdhatv4 (sandbox-chapter-1)
$ cd frontend && npx eslint .
(node:30104) ESLintIgnoreWarning: The ".eslintignore" file is no longer supported. Switch to using the "ignores" property in "eslint.config.js": https://eslint.org/docs/latest/use/configure/migration-guide#ignoring-files
(Use `node --trace-warnings ...` to show where the warning was created)

C:\Users\Pawel\Hrdhatv4\frontend\src\app\app.tsx
1:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `app.tsx` to same directory as `@/components/ResponsiveLayout/ResponsiveLayout` or consider making `@/components/ResponsiveLayout/ResponsiveLayout` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\app\provider.tsx
4:26 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `provider.tsx` to same directory as `@/config/supabaseClient` or consider making `@/config/supabaseClient` a package import/no-relative-parent-imports
5:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `provider.tsx` to same directory as `@/stores/authStore` or consider making `@/stores/authStore` a package import/no-relative-parent-imports
6:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `provider.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\app\router.tsx
5:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `router.tsx` to same directory as `@/stores/authStore` or consider making `@/stores/authStore` a package import/no-relative-parent-imports
6:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `router.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\app\routes\ActiveFormsList.tsx
4:29 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `ActiveFormsList.tsx` to same directory as `@/lib/formService` or consider making `@/lib/formService` a package import/no-relative-parent-imports  
 5:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `ActiveFormsList.tsx` to same directory as `@/stores/authStore` or consider making `@/stores/authStore` a package import/no-relative-parent-imports  
 6:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `ActiveFormsList.tsx` to same directory as `@/stores/formStore` or consider making `@/stores/formStore` a package import/no-relative-parent-imports  
 7:35 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `ActiveFormsList.tsx` to same directory as `@/types/form` or consider making `@/types/form` a package import/no-relative-parent-imports  
 8:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `ActiveFormsList.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports  
 20:6 warning React Hook useEffect has a missing dependency: 'loadActiveForms'. Either include it or remove the dependency array  
 react-hooks/exhaustive-deps

C:\Users\Pawel\Hrdhatv4\frontend\src\app\routes\FormEditor.tsx
6:1 warning Unused eslint-disable directive (no problems were reported from 'import/order')  
 7:28 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormEditor.tsx` to same directory as `@/components/form/FormHeader` or consider making `@/components/form/FormHeader` a package  
 import/no-relative-parent-imports
8:32 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormEditor.tsx` to same directory as `@/components/form/ModuleRenderer` or consider making `@/components/form/ModuleRenderer` a package  
 import/no-relative-parent-imports
11:1 warning Unused eslint-disable directive (no problems were reported from 'import/order')  
 12:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormEditor.tsx` to same directory as `@/features/form-editor/FormLayout` or consider making `@/features/form-editor/FormLayout` a package  
 import/no-relative-parent-imports
13:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormEditor.tsx` to same directory as `@/features/form-editor/FormModeProvider` or consider making `@/features/form-editor/FormModeProvider` a package import/no-relative-parent-imports
16:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormEditor.tsx` to same directory as `@/stores/authStore` or consider making `@/stores/authStore` a package  
 import/no-relative-parent-imports
17:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormEditor.tsx` to same directory as `@/stores/formStore` or consider making `@/stores/formStore` a package  
 import/no-relative-parent-imports
18:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormEditor.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package  
 import/no-relative-parent-imports
21:8 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormEditor.tsx` to same directory as `@/styles/components/form-editor.css` or consider making `@/styles/components/form-editor.css` a package  
 import/no-relative-parent-imports
70:6 warning React Hook useEffect has a missing dependency: 'user'. Either include it or remove the dependency array

react-hooks/exhaustive-deps
92:6 warning React Hook useEffect has a missing dependency: 'currentForm'. Either include it or remove the dependency array

react-hooks/exhaustive-deps
164:56 warning Unexpected any. Specify a different type

@typescript-eslint/no-explicit-any
167:47 warning Unexpected any. Specify a different type

@typescript-eslint/no-explicit-any

C:\Users\Pawel\Hrdhatv4\frontend\src\app\routes\Login.tsx
4:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `Login.tsx` to same directory as `@/stores/authStore` or consider making `@/stores/authStore` a package import/no-relative-parent-imports
5:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `Login.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\app\routes\Profile.tsx
3:28 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `Profile.tsx` to same directory as `@/components/LogoUpload` or consider making `@/components/LogoUpload` a package import/no-relative-parent-imports
4:26 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `Profile.tsx` to same directory as `@/config/supabaseClient` or consider making `@/config/supabaseClient` a package import/no-relative-parent-imports
5:29 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `Profile.tsx` to same directory as `@/lib/formService` or consider making `@/lib/formService` a package import/no-relative-parent-imports
6:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `Profile.tsx` to same directory as `@/stores/authStore` or consider making `@/stores/authStore` a package import/no-relative-parent-imports
7:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `Profile.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\app\routes\SidebarLoggedIn.tsx
4:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `SidebarLoggedIn.tsx` to same directory as `@/stores/authStore` or consider making `@/stores/authStore` a package import/no-relative-parent-imports  
 5:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `SidebarLoggedIn.tsx` to same directory as `@/stores/formStore` or consider making `@/stores/formStore` a package import/no-relative-parent-imports  
 6:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `SidebarLoggedIn.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\app\routes\Signup.tsx
4:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `Signup.tsx` to same directory as `@/stores/authStore` or consider making `@/stores/authStore` a package import/no-relative-parent-imports
5:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `Signup.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\app\routes\VerifyEmail.tsx
3:26 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `VerifyEmail.tsx` to same directory as `@/config/supabaseClient` or consider making `@/config/supabaseClient` a package import/no-relative-parent-imports
4:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `VerifyEmail.tsx` to same directory as `@/stores/authStore` or consider making `@/stores/authStore` a package import/no-relative-parent-imports
5:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `VerifyEmail.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\components\Debug\ModeDeviceBanner.tsx
4:29 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `ModeDeviceBanner.tsx` to same directory as `@/features/form-editor/FormModeProvider` or consider making `@/features/form-editor/FormModeProvider` a package import/no-relative-parent-imports
6:27 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `ModeDeviceBanner.tsx` to same directory as `@/hooks/useBreakpoint` or consider making `@/hooks/useBreakpoint` a package  
 import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\components\LogoUpload.tsx
3:29 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `LogoUpload.tsx` to same directory as `@/lib/formService` or consider making `@/lib/formService` a package import/no-relative-parent-imports  
 4:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `LogoUpload.tsx` to same directory as `@/stores/authStore` or consider making `@/stores/authStore` a package import/no-relative-parent-imports  
 5:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `LogoUpload.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports  
 44:7 warning Unexpected console statement

                                                                 no-console

48:7 warning Unexpected console statement

                                                                 no-console

52:7 warning Unexpected console statement

                                                                 no-console

55:7 warning Unexpected console statement

                                                                 no-console

58:7 warning Unexpected console statement

                                                                 no-console

62:9 warning Unexpected console statement

                                                                 no-console

C:\Users\Pawel\Hrdhatv4\frontend\src\components\form\FormHeader.tsx
3:28 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormHeader.tsx` to same directory as `@/components/LogoUpload` or consider making `@/components/LogoUpload` a package import/no-relative-parent-imports
4:26 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormHeader.tsx` to same directory as `@/config/supabaseClient` or consider making `@/config/supabaseClient` a package import/no-relative-parent-imports
5:29 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormHeader.tsx` to same directory as `@/lib/formService` or consider making `@/lib/formService` a package import/no-relative-parent-imports
6:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormHeader.tsx` to same directory as `@/stores/authStore` or consider making `@/stores/authStore` a package import/no-relative-parent-imports
7:35 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormHeader.tsx` to same directory as `@/types/form` or consider making `@/types/form` a package import/no-relative-parent-imports
8:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormHeader.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports
48:5 warning Unexpected console statement

                                                                           no-console

49:5 warning Unexpected console statement

                                                                           no-console

51:5 warning Unexpected console statement

                                                                           no-console

C:\Users\Pawel\Hrdhatv4\frontend\src\components\form\ModuleRenderer.tsx
3:39 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `ModuleRenderer.tsx` to same directory as `@/types/form` or consider making `@/types/form` a package import/no-relative-parent-imports
4:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `ModuleRenderer.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports
17:15 warning Unexpected any. Specify a different type

                                                             @typescript-eslint/no-explicit-any

18:44 warning Unexpected any. Specify a different type

                                                             @typescript-eslint/no-explicit-any

19:32 warning Unexpected any. Specify a different type

                                                             @typescript-eslint/no-explicit-any

58:55 warning Unexpected any. Specify a different type

                                                             @typescript-eslint/no-explicit-any

58:67 warning Unexpected any. Specify a different type

                                                             @typescript-eslint/no-explicit-any

63:28 warning Unexpected any. Specify a different type

                                                             @typescript-eslint/no-explicit-any

C:\Users\Pawel\Hrdhatv4\frontend\src\components\form\fields\BooleanFieldComponent.tsx
5:16 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

C:\Users\Pawel\Hrdhatv4\frontend\src\components\form\fields\DateFieldComponent.tsx
5:16 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

C:\Users\Pawel\Hrdhatv4\frontend\src\components\form\fields\PhotoModule.tsx
3:36 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `PhotoModule.tsx` to same directory as `@/config/moduleConstraints` or consider making `@/config/moduleConstraints` a package import/no-relative-parent-imports
4:26 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `PhotoModule.tsx` to same directory as `@/config/supabaseClient` or consider making `@/config/supabaseClient` a package import/no-relative-parent-imports
5:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `PhotoModule.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports
6:8 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `PhotoModule.tsx` to same directory as `@/styles/components/photo-module.css` or consider making `@/styles/components/photo-module.css` a package import/no-relative-parent-imports
8:1 warning Unused eslint-disable directive (no problems were reported from 'jsx-a11y/no-static-element-interactions')
11:15 warning Unexpected any. Specify a different type

                                                                                                       @typescript-eslint/no-explicit-any

12:21 warning Unexpected any. Specify a different type

                                                                                                       @typescript-eslint/no-explicit-any

13:26 warning Unexpected any. Specify a different type

                                                                                                       @typescript-eslint/no-explicit-any

133:45 warning Unexpected any. Specify a different type

                                                                                                       @typescript-eslint/no-explicit-any

C:\Users\Pawel\Hrdhatv4\frontend\src\components\form\fields\SignatureModule.tsx
3:36 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `SignatureModule.tsx` to same directory as `@/config/moduleConstraints` or consider making `@/config/moduleConstraints` a package  
 import/no-relative-parent-imports
4:26 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `SignatureModule.tsx` to same directory as `@/config/supabaseClient` or consider making `@/config/supabaseClient` a package  
 import/no-relative-parent-imports
5:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `SignatureModule.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package  
 import/no-relative-parent-imports
7:8 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `SignatureModule.tsx` to same directory as `@/styles/components/signature-module.css` or consider making `@/styles/components/signature-module.css` a package import/no-relative-parent-imports
10:15 warning Unexpected any. Specify a different type

         @typescript-eslint/no-explicit-any

11:21 warning Unexpected any. Specify a different type

         @typescript-eslint/no-explicit-any

12:26 warning Unexpected any. Specify a different type

         @typescript-eslint/no-explicit-any

C:\Users\Pawel\Hrdhatv4\frontend\src\components\form\fields\TaskHazardControlComponent.tsx
4:36 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `TaskHazardControlComponent.tsx` to same directory as `@/config/moduleConstraints` or consider making `@/config/moduleConstraints` a package import/no-relative-parent-imports
5:44 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `TaskHazardControlComponent.tsx` to same directory as `@/config/moduleConstraints` or consider making `@/config/moduleConstraints` a package import/no-relative-parent-imports
8:15 warning Unexpected any. Specify a different type

                                                                                                 @typescript-eslint/no-explicit-any

9:21 warning Unexpected any. Specify a different type

                                                                                                 @typescript-eslint/no-explicit-any

10:26 warning Unexpected any. Specify a different type

                                                                                                 @typescript-eslint/no-explicit-any

45:47 warning Unexpected any. Specify a different type

                                                                                                 @typescript-eslint/no-explicit-any

49:61 warning Unexpected any. Specify a different type

                                                                                                 @typescript-eslint/no-explicit-any

C:\Users\Pawel\Hrdhatv4\frontend\src\components\form\fields\TextFieldComponent.tsx
5:16 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

C:\Users\Pawel\Hrdhatv4\frontend\src\config\moduleConstraints.ts
130:76 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any
143:63 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any
150:63 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

C:\Users\Pawel\Hrdhatv4\frontend\src\features\form-editor\FormLayout.tsx
3:1 error There should be no empty line within import group

                                                                                                  import/order

3:30 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `FormLayout.tsx` to same directory as `@/components/Debug/ModeDeviceBanner` or consider making `@/components/Debug/ModeDeviceBanner` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\features\form-editor\FormModeProvider.tsx
38:17 warning Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components react-refresh/only-export-components

C:\Users\Pawel\Hrdhatv4\frontend\src\lib\formService.ts
8:26 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `formService.ts` to same directory as `@/config/supabaseClient` or consider making `@/config/supabaseClient` a package import/no-relative-parent-imports
14:3 error 'ModuleDefinition' is defined but never used

                                                                            @typescript-eslint/no-unused-vars

15:8 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `formService.ts` to same directory as `@/types/form` or consider making `@/types/form` a package import/no-relative-parent-imports
16:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `formService.ts` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports
351:58 warning Unexpected any. Specify a different type

                                                                            @typescript-eslint/no-explicit-any

351:64 warning Unexpected any. Specify a different type

                                                                            @typescript-eslint/no-explicit-any

352:20 warning Unexpected any. Specify a different type

                                                                            @typescript-eslint/no-explicit-any

361:44 warning Unexpected any. Specify a different type

                                                                            @typescript-eslint/no-explicit-any

364:29 warning Unexpected any. Specify a different type

                                                                            @typescript-eslint/no-explicit-any

366:48 warning Unexpected any. Specify a different type

                                                                            @typescript-eslint/no-explicit-any

394:54 warning Unexpected any. Specify a different type

                                                                            @typescript-eslint/no-explicit-any

C:\Users\Pawel\Hrdhatv4\frontend\src\stores\authStore.ts
3:1 error There should be at least one empty line between import groups

                                                                         import/order

3:26 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `authStore.ts` to same directory as `@/config/supabaseClient` or consider making `@/config/supabaseClient` a package import/no-relative-parent-imports
4:1 error There should be at least one empty line between import groups

                                                                         import/order

4:1 error `@supabase/supabase-js` type import should occur before import of `zustand`

                                                                         import/order

5:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `authStore.ts` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports
68:11 warning Unused eslint-disable directive (no problems were reported from '@typescript-eslint/naming-convention')
70:11 warning Unused eslint-disable directive (no problems were reported from '@typescript-eslint/naming-convention')

C:\Users\Pawel\Hrdhatv4\frontend\src\stores\formStore.ts
3:29 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `formStore.ts` to same directory as `@/lib/formService` or consider making `@/lib/formService` a package import/no-relative-parent-imports
9:8 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `formStore.ts` to same directory as `@/types/form` or consider making `@/types/form` a package import/no-relative-parent-imports
10:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `formStore.ts` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports
26:64 warning Unexpected any. Specify a different type

                                                              @typescript-eslint/no-explicit-any

27:53 warning Unexpected any. Specify a different type

                                                              @typescript-eslint/no-explicit-any

150:64 warning Unexpected any. Specify a different type

                                                              @typescript-eslint/no-explicit-any

182:53 warning Unexpected any. Specify a different type

                                                              @typescript-eslint/no-explicit-any

272:46 warning Unexpected any. Specify a different type

                                                              @typescript-eslint/no-explicit-any

275:50 warning Unexpected any. Specify a different type

                                                              @typescript-eslint/no-explicit-any

C:\Users\Pawel\Hrdhatv4\frontend\src\stores\formsListStore.ts
3:29 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `formsListStore.ts` to same directory as `@/lib/formService` or consider making `@/lib/formService` a package import/no-relative-parent-imports  
 4:35 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `formsListStore.ts` to same directory as `@/types/form` or consider making `@/types/form` a package import/no-relative-parent-imports  
 5:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `formsListStore.ts` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\testing\sample.test.tsx
4:24 warning Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `sample.test.tsx` to same directory as `@/utils/logger` or consider making `@/utils/logger` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\types\form.ts
26:21 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any
27:21 warning Unexpected any. Specify a different type @typescript-eslint/ns/logger`or consider making`@/utils/logger` a package import/no-relative-parent-imports

C:\Users\Pawel\Hrdhatv4\frontend\src\types\form.ts
26:21 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any
27:21 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any
45:14 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any
65:18 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any
77:18 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any
96:18 warning Unexpected any. Specify a different type @typescript-eslint/no-explicit-any

✖ 138 problems (5 errors, 133 warnings)
4 errors and 5 warnings potentially fixable with the `--fix` option.

Pawel@LAPTOP-C4448CI9 MINGW64 ~/Hrdhatv4/frontend (sandbox-chapter-1)
$ rm .eslintcache
