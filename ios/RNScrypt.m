//
//  RNScrypt.m
//  RNScrypt
//
//  Created by Yiorgis Gozadinos on 23/11/2017.
//  Copyright © 2017 Crypho AS. All rights reserved.
//


#import "RNScrypt.h"
#import "libscrypt.h"
#import <Foundation/Foundation.h>

#include <stdbool.h>
#include <stdint.h>

@implementation RNScrypt

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(scrypt, scrypt:(NSString *)passwd
                 salt:(NSArray *)salt
                 N:(NSUInteger)N
                 r:(NSUInteger)r
                 p:(NSUInteger)p
                 dkLen:(NSUInteger)dkLen
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    int i, success;
    size_t saltLength;
    uint8_t hashbuf[dkLen];
    const uint8_t *parsedSalt;
    uint8_t *buffer = NULL;
    const char* passphrase = [passwd UTF8String];

    saltLength = (int) [salt count];
    buffer = malloc(sizeof(uint8_t) * saltLength);
    for (i = 0; i < saltLength; ++i) {
        buffer[i] = (uint8_t)[[salt objectAtIndex:i] integerValue];
    }
    parsedSalt = buffer;

    @try {
        success = libscrypt_scrypt((uint8_t *)passphrase, strlen(passphrase), parsedSalt, saltLength, N, r, p, hashbuf, dkLen);
    }
    @catch (NSException * e) {
        NSError *error = [NSError errorWithDomain:@"com.crypho.scrypt" code:200 userInfo:@{@"Error reason": @"Error in scrypt"}];
        reject(@"Failure in scrypt", @"Error", error);
    }

    NSMutableString *hexResult = [NSMutableString stringWithCapacity:dkLen * 2];
    for(i = 0;i < dkLen; i++ )
    {
        [hexResult appendFormat:@"%02x", hashbuf[i]];
    }
    NSString *result = [NSString stringWithString: hexResult];
    resolve(result);
    free(buffer);
}

RCT_REMAP_METHOD(scrypt_b64, scrypt_b64:(NSString *)base64Password
                 salt:(NSString *)base64Salt
                 N:(NSUInteger)N
                 r:(NSUInteger)r
                 p:(NSUInteger)p
                 dkLen:(NSUInteger)dkLen
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    NSData *password = [[NSData alloc] initWithBase64EncodedString:base64Password options:kNilOptions];
    NSData *salt = [[NSData alloc] initWithBase64EncodedString:base64Salt options:kNilOptions];

    
    int i, success;
    
    uint8_t hashbuf[dkLen];
    
    @try {
        success = libscrypt_scrypt((uint8_t *)[password bytes], [password length], (uint8_t *)[salt bytes], [salt length], N, r, p, hashbuf, dkLen);
    }
    @catch (NSException * e) {
        NSError *error = [NSError errorWithDomain:@"com.crypho.scrypt" code:200 userInfo:@{@"Error reason": @"Error in scrypt"}];
        reject(@"Failure in scrypt", @"Error", error);
    }

    NSData *keyData = [NSData dataWithBytes:hashbuf length:dkLen];
    NSString *keyBase64 = [keyData base64EncodedStringWithOptions:kNilOptions];
    
    NSString *result = [NSString stringWithString: keyBase64];
    
    resolve(result);
}

@end
