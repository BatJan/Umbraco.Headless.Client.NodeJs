import {Endpoint, EndpointSource} from "./Endpoint";
import {DepthOptions, MultipartOptions, PageOptions} from "./RequestOptions";
import {ApiPagedResponse, ApiResponse} from "./ApiResponse";
import {
    ContentManagerMediaType,
    ContentResponseElement,
    ContentTypeBase,
    ContentTypeBaseResponse,
    RootContentResponse,
    ContentManagerMediaTypeBase,
    MediaTypeContentManagerRoot,
    MediaTypeContentManager,
    ContentLanguageRootType,
    ContentLanguageType,
    ContentRelationType,
    ContentRelationRootType,
    ContentRelationTypeType,
    ContentMemberType,
    ContentMemberGroupType, ContentMemberTypeTypeGroup, ContentMemberTypeType
} from "./Responses";

type RCR<T extends ContentResponseElement> = ApiResponse<RootContentResponse<T>>
type CTR<T extends ContentTypeBase> = ApiResponse<ContentTypeBaseResponse<T>>
type CMT<T extends ContentManagerMediaType> = ApiResponse<ContentManagerMediaTypeBase<T>>

export const Endpoints = {

    cdn: {

        root: <T extends ContentResponseElement>() => new Endpoint<RCR<T>>(EndpointSource.CDN, '/content', {}, 'get'),
        byId: <T extends ContentResponseElement>(id: string | number, options?: DepthOptions) => new Endpoint<RCR<T>>(EndpointSource.CDN, '/content/{id}', {id}, 'get', options),
        byUrl: <T extends ContentResponseElement>(url: string, options?: DepthOptions) => new Endpoint<T>(EndpointSource.CDN, '/content/url?url={url}', {url}, 'get', options),
        children: <T extends ContentResponseElement>(id: string | number, options?: PageOptions) => new Endpoint<ApiPagedResponse<RootContentResponse<T>>>(EndpointSource.CDN, '/content/{id}/children', {id}, 'get', options),
        ancestors: (id: string | number) => new Endpoint(EndpointSource.CDN, '/content/{id}/ancestors', {id}, 'get'),
        descendants: (id: string | number, options?: PageOptions) => new Endpoint(EndpointSource.CDN, '/content/{id}/descendants', {id}, 'get', options)
    },

    media: {
        root: () => new Endpoint(EndpointSource.CDN, "/media", {}, 'get'),
        byId: (id: string | number) => new Endpoint(EndpointSource.CDN, '/media/{id}', {id}, 'get'),
        children: (id: string | number, options?: PageOptions) => new Endpoint(EndpointSource.CDN, '/media/{id}/children', {id}, 'get', options),
    },

    management: {
        content: {
            root: <R extends ContentResponseElement>() => new Endpoint<RCR<R>>(EndpointSource.ContentManagement, "/content", {}, 'get'),
            byId: <R extends ContentResponseElement>(id: string | number) => new Endpoint<R>(EndpointSource.ContentManagement, '/content/{id}', {id}, 'get'),
            children: <R extends ContentResponseElement>(id: string | number, options?: PageOptions) => new Endpoint<RCR<R>>(EndpointSource.ContentManagement, '/content/{id}/children', {id}, 'get', options),
            create: <R extends ContentResponseElement>() => new Endpoint<R>(EndpointSource.ContentManagement, '/content', {}, 'post'),
            publish: <R extends ContentResponseElement>(id: string | number) => {
               return new Endpoint<R>(EndpointSource.ContentManagement, '/content/{id}/publish', {id}, 'put') as Endpoint<R>
            },
            unPublish: <R extends ContentResponseElement>(id: number|string) => new Endpoint<R>(EndpointSource.ContentManagement, '/content/{id}/unpublish', {id}, 'put'),
            update: <R extends ContentResponseElement>(id: number | string) => new Endpoint<R>(EndpointSource.ContentManagement, '/content/{id}', {id}, 'put'),
            delete: (id: number | string) => new Endpoint(EndpointSource.ContentManagement, '/content/{id}', {id}, 'delete'),
        },
        contentType: {
            all: <R extends ContentTypeBase>() => new Endpoint<CTR<R>>(EndpointSource.ContentManagement, '/content/type', {}, 'get'),
            byAlias: <R extends ContentTypeBase>(alias: string) => new Endpoint<R>(EndpointSource.ContentManagement, '/content/type/{alias}', {alias}, 'get'),
        },
        media: {
            root:  <R extends ContentManagerMediaType>() => new Endpoint<CMT<R>>(EndpointSource.ContentManagement, '/media', {}, 'get'),
            byId: <R extends ContentManagerMediaType>(id: string|number) => new Endpoint<R>(EndpointSource.ContentManagement, '/media/{id}', {id}, 'get'),
            children: <R extends ContentManagerMediaType>(id: string|number, options?: PageOptions) => new Endpoint<CMT<R>>(EndpointSource.ContentManagement, '/media/{id}/children', {id}, 'get', options),
            create: () => new Endpoint<any, MultipartOptions>(EndpointSource.ContentManagement, '/media', {}, 'post', {usingMultipart: true}),
            update: (id: string|number) => new Endpoint(EndpointSource.ContentManagement, '/media/{id}', {id}, 'put'),
            delete: (id: string|number) => new Endpoint(EndpointSource.ContentManagement, '/media/{id}', {id}, 'delete'),
        },

        mediaType: {
            all: () => new Endpoint<MediaTypeContentManagerRoot>(EndpointSource.ContentManagement, '/media/type', {}, 'get'),
            byAlias: (alias: string) => new Endpoint<MediaTypeContentManager>(EndpointSource.ContentManagement, '/media/type/{alias}', {alias}, 'get'),
        },

        language: {
            all: <R extends ContentLanguageType>() => new Endpoint<ApiResponse<ContentLanguageRootType<R>>>(EndpointSource.ContentManagement, '/language', {}, 'get'),
            byISOCode: <R extends ContentLanguageType>(id: string) => new Endpoint<R>(EndpointSource.ContentManagement, '/language/{id}', {id}, 'get'),
            create: <R extends ContentLanguageType>() => new Endpoint<R>(EndpointSource.ContentManagement, '/language', {}, 'post'),
            update: <R extends ContentLanguageType>(id: string) => new Endpoint<R>(EndpointSource.ContentManagement, '/language/{id}', {id}, 'put'),
            delete: <R extends ContentLanguageType>(id: string) => new Endpoint<R>(EndpointSource.ContentManagement, '/language/{id}', {id}, 'delete'),

        },

        relation: {
            byId: (id: string|number) => new Endpoint<ContentRelationType>(EndpointSource.ContentManagement, '/relation/{id}', {id}, 'get'),
            byParent: (id: string) => new Endpoint<ContentRelationRootType<ContentRelationType>>(EndpointSource.ContentManagement, '/relation/parent/{id}', {id}, 'get'),
            byChild: (id: string) => new Endpoint<ContentRelationRootType<ContentRelationType>>(EndpointSource.ContentManagement, '/relation/child/{id}', {id}, 'get'),
            byAlias: (alias: string) => new Endpoint<ContentRelationRootType<ContentRelationType>>(EndpointSource.ContentManagement, '/relation/{alias}', {alias}, 'get'),
            create: () => new Endpoint<ContentRelationType>(EndpointSource.ContentManagement, '/relation', {}, 'post'),
            delete: (id: string|number) => new Endpoint<ContentRelationType>(EndpointSource.ContentManagement, '/relation/{id}', {id}, 'delete'),
        },

        relationType: {
            byAlias: (alias: string) => new Endpoint<ContentRelationTypeType>(EndpointSource.ContentManagement, '/relation/type/{alias}', {alias}, 'get')
        },


        member: {
            byUsername: <R extends ContentMemberType>(username: string) => new Endpoint<R>(EndpointSource.ContentManagement, '/member/{username}', {username}, 'get'),
            create: <R extends ContentMemberType>() => new Endpoint<R>(EndpointSource.ContentManagement, '/member', {}, 'post'),
            update: <R extends ContentMemberType>(username: string) => new Endpoint<R>(EndpointSource.ContentManagement, '/member/{username}', {username}, 'put'),
            addGroup: (username: string, group: string) => new Endpoint(EndpointSource.ContentManagement, '/member/{username}/groups/{group}', {username, group}, 'put'),
            removeGroup: (username: string, group: string) => new Endpoint(EndpointSource.ContentManagement, '/member/{username}/groups/{group}', {username, group}, 'delete'),
            delete: (username: string) => new Endpoint(EndpointSource.ContentManagement, '/member/{username}', {username}, 'delete'),
        },

        memberGroup: {
            byName: (name: string) => new Endpoint<ContentMemberGroupType>(EndpointSource.ContentManagement, '/member/group/{name}', {name}, 'get'),
            create: () => new Endpoint<ContentMemberGroupType>(EndpointSource.ContentManagement, '/member/group', {}, 'post'),
            delete: (name: string) => new Endpoint<ContentMemberGroupType>(EndpointSource.ContentManagement, '/member/group/{name}', {name}, 'delete'),
        },

        memberType: {
            all: <R extends ContentMemberTypeType>() => new Endpoint<ContentMemberTypeTypeGroup<R>>(EndpointSource.ContentManagement, '/member/type', {}, 'get'),
            byAlias: <R extends ContentMemberTypeType>(alias: string) => new Endpoint<R>(EndpointSource.ContentManagement, '/member/type/{alias}', {alias}, 'get')
        }
    }
}