# AI Agents

Cada agente se registra con identidad, descripción, capacidades, herramientas, permisos, esquemas de entrada/salida, política y configuración de auditoría.

| Agente | Herramientas iniciales | Permisos |
|---|---|---|
| tutor | course_context, progress_read | read_course, read_own_progress, create_recommendation |
| socratic | hint_library | read_course, create_hint |
| lab | lab_api | read_lab, start_lab, read_lab_output, submit_lab |
| assessment | rubric_engine | read_submission, propose_assessment |
| academic | curriculum_graph | read_program, create_recommendation |
| research | approved_search, retriever | read_approved_sources, cite_source |
| security | scenario_analyzer | read_lab_context, produce_defensive_analysis |
| voice | tts_provider | synthesize_consented_text |
| orchestrator | agent_registry | route_request |

Denegaciones globales: modificar identidad, borrar estudiantes, cambiar nota final, emitir credenciales, acceder a datos privados ajenos o modificar seguridad del sistema. Toda excepción exige autorización humana explícita.
