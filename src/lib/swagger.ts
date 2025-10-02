import type { OpenAPIV3 } from 'openapi-types';

const approvalEnum = ['Pending', 'Approved', 'Not Approved'] as const;

export const openApiSpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Teams API',
    version: '1.0.0',
    description: 'CRUD and approvals for Teams',
  },
  servers: [{ url: '/' }],
  tags: [{ name: 'Teams' }],
  components: {
    schemas: {
      ApiResponseTeam: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { $ref: '#/components/schemas/Team' },
        },
      },
      ApiResponseDeleted: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: { _id: { type: 'string' } },
          },
        },
      },
      Member: {
        type: 'object',
        required: ['name', 'gender', 'dateOfBirth', 'contact'],
        properties: {
          name: { type: 'string' },
          gender: { type: 'string' },
          dateOfBirth: { type: 'string', format: 'date-time' },
          contact: { type: 'string' },
        },
      },
      Team: {
        type: 'object',
        required: ['name', 'description', 'managerApproval', 'directorApproval', 'members'],
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          managerApproval: { type: 'string', enum: [...approvalEnum] },
          directorApproval: { type: 'string', enum: [...approvalEnum] },
          members: { type: 'array', items: { $ref: '#/components/schemas/Member' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateTeamRequest: {
        type: 'object',
        required: ['name', 'description'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          members: { type: 'array', items: { $ref: '#/components/schemas/Member' } },
        },
      },
      UpdateTeamRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          members: { type: 'array', items: { $ref: '#/components/schemas/Member' } },
        },
      },
      ApproveRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: [...approvalEnum] },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          details: {},
        },
      },
      PaginatedTeams: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'array', items: { $ref: '#/components/schemas/Team' } },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              pages: { type: 'integer' },
            },
          },
        },
      },
    },
  },
  paths: {
    '/api/teams': {
      get: {
        tags: ['Teams'],
        summary: 'List teams with pagination',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedTeams' } } } },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      post: {
        tags: ['Teams'],
        summary: 'Create a team',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTeamRequest' } } },
        },
        responses: {
          201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseTeam' } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/teams/{id}': {
      get: {
        tags: ['Teams'],
        summary: 'Get team by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseTeam' } } } },
          404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      put: {
        tags: ['Teams'],
        summary: 'Update team',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTeamRequest' } } } },
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseTeam' } } } },
          400: { description: 'Validation error' },
          404: { description: 'Not found' },
        },
      },
      delete: {
        tags: ['Teams'],
        summary: 'Delete team',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseDeleted' } } } },
          404: { description: 'Not found' },
        },
      },
    },
    '/api/teams/{id}/manager-approve': {
      patch: {
        tags: ['Teams'],
        summary: 'Manager approval update',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ApproveRequest' } } } },
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseTeam' } } } },
          400: { description: 'Validation error' },
          404: { description: 'Not found' },
        },
      },
    },
    '/api/teams/{id}/director-approve': {
      patch: {
        tags: ['Teams'],
        summary: 'Director approval update',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ApproveRequest' } } } },
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponseTeam' } } } },
          400: { description: 'Validation error' },
          404: { description: 'Not found' },
        },
      },
    },
  },
};


